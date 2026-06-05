import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const leadsRef = collection(db, 'leads');
    const snapshot = await getDocs(leadsRef);
    const gemini = getGemini();

    const now = new Date();
    let actionsTaken = 0;

    for (const leadDoc of snapshot.docs) {
      const lead = leadDoc.data();
      const phoneNumber = leadDoc.id;
      
      // Calculate days inactive
      if (!lead.lastMessageAt) continue;
      
      let lastMsgDate: Date;
      if (lead.lastMessageAt instanceof Timestamp) {
        lastMsgDate = lead.lastMessageAt.toDate();
      } else if (lead.lastMessageAt?.seconds) {
        lastMsgDate = new Date(lead.lastMessageAt.seconds * 1000);
      } else {
        lastMsgDate = new Date(lead.lastMessageAt);
      }
      
      const diffTime = Math.abs(now.getTime() - lastMsgDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      // Check automation rules
      let ruleToRun = null;
      let promptIntent = "";
      let eventStatus = "";
      
      // Determine if a follow-up is needed based on inactivity days and track if we've already sent it
      const followUpStage = lead.followUpStage || 0;
      
      if (diffDays >= 30 && followUpStage < 30) {
        ruleToRun = "Day 30 Recovery";
        promptIntent = "The lead has been inactive for 30+ days. Write a final attempt recovery message offering a massive discount or urgency.";
        eventStatus = "Recovering";
      } else if (diffDays >= 14 && followUpStage < 14) {
        ruleToRun = "Day 14 Re-engagement";
        promptIntent = "The lead has been inactive for 14 days. Write a re-engagement message pivoting the offer or asking for quick feedback on why they went quiet.";
        eventStatus = "Re-engaging";
      } else if (diffDays >= 7 && followUpStage < 7) {
        ruleToRun = "Day 7 Follow-up";
        promptIntent = "The lead has been inactive for 7 days. Write a helpful follow-up addressing common objections and providing immediate value or a useful resource.";
        eventStatus = "Nurturing";
      } else if (diffDays >= 3 && followUpStage < 3) {
        ruleToRun = "Day 3 Reminder";
        promptIntent = "The lead has been inactive for 3 days. Write a gentle, friendly check-in reminder about their previous inquiry.";
        eventStatus = "Follow-up";
      }

      if (ruleToRun) {
        // Fetch context (last messages)
        const msgsRef = collection(db, 'leads', phoneNumber, 'messages');
        const msgsSnapshot = await getDocs(msgsRef);
        const conversationHistory = msgsSnapshot.docs
          .map(d => d.data().text)
          .slice(-3) // last 3 msgs
          .join('\\n');

        const prompt = `
You are an expert sales assistant. You need to write an automated follow-up message to a lead.
Rule triggered: ${ruleToRun}
Intent: ${promptIntent}
Lead Name: ${lead.name || 'Friend'}

Recent conversation:
---
${conversationHistory || "No previous history accessible."}
---

Generate ONLY the exact message you would send via WhatsApp. No conversational filler, quotes, or JSON. Just the message body. Make it conversational, polite, and persuasive.
`;

        const response = await gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });

        const generatedMessage = response.text?.trim();

        if (generatedMessage) {
          // Send actual message via WhatsApp Cloud API
          const API_URL = new URL('/api/whatsapp/send', req.url).toString();
          const sendRes = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: phoneNumber, text: generatedMessage })
          });
          
          if (!sendRes.ok) {
            console.error(`Failed to send automated message to ${phoneNumber}`);
            continue;
          }

          // 2. Add an internal note about the automation
          const currentNotes = lead.notes || [];
          const newNote = {
            text: `System matched rule: ${ruleToRun}. Sent automated AI message.`,
            timestamp: new Date()
          };

          // 3. Update the lead doc
          await setDoc(doc(db, 'leads', phoneNumber), {
            followUpStage: diffDays >= 30 ? 30 : diffDays >= 14 ? 14 : diffDays >= 7 ? 7 : 3,
            status: eventStatus,
            notes: [...currentNotes, newNote],
            updatedAt: serverTimestamp()
          }, { merge: true });

          console.log(`✅ Executed [${ruleToRun}] for lead ${phoneNumber}`);
          actionsTaken++;
        }
      }
    }

    return NextResponse.json({ success: true, actionsTaken }, { status: 200 });

  } catch (error) {
    console.error("Automation error:", error);
    return NextResponse.json({ error: "Failed to run automation" }, { status: 500 });
  }
}
