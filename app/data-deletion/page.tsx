export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-white p-8 md:p-16 text-slate-800">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold font-display text-slate-900">Data Deletion Instructions</h1>
        <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-4">
          <p>According to the Facebook Platform rules, we have to provide User Data Deletion Callback URL or Data Deletion Instructions URL.</p>
          <p>If you want to delete your activities for LeadPilot, you can remove your information by following these steps:</p>
          
          <ol className="list-decimal pl-6 space-y-2 mt-4">
            <li>Go to your Facebook Account's Setting & Privacy. Click "Settings".</li>
            <li>Look for "Apps and Websites" and you will see all of the apps and websites you linked with your Facebook.</li>
            <li>Search and Click "LeadPilot" in the search bar.</li>
            <li>Scroll and click "Remove".</li>
            <li>Congratulations, you have successfully removed your app activities.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
