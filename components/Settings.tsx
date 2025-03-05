import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Download, Upload, Trash2 } from 'lucide-react';
import { storage } from '@/lib/storage';
import { useToast } from '@/components/ui/use-toast';

export function Settings() {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      const text = await file.text();
      await storage.importData(text);
      toast({
        title: "Data imported successfully",
        description: "Your data has been imported. You may need to refresh the page.",
      });
      window.location.reload(); // Refresh to show imported data
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing your data. Please make sure the file is valid.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await storage.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'habits-backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Your data has been exported to a JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
    }
  };

  const handleClearData = async () => {
    try {
      await storage.clearAllData();
      toast({
        title: "Data cleared",
        description: "All your data has been deleted. The page will refresh.",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button
            onClick={() => document.getElementById('import-file')?.click()}
            disabled={importing}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
        </div>
        <input
          type="file"
          id="import-file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />
        <Button
          variant="destructive"
          onClick={handleClearData}
          className="w-full"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All Data
        </Button>
        <div className="p-4 border rounded-lg bg-muted/50">
          <div className="flex items-start">
            <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 text-yellow-500" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Important Notes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your data is stored locally in your browser</li>
                <li>Clearing browser data/cache will delete all your habits data</li>
                <li>Regular backups are recommended to prevent data loss</li>
                <li>You can import data from another device using the export/import feature</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
