import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Download, Upload, Trash2 } from 'lucide-react';
import { StorageService } from '../lib/storage';
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
      await StorageService.getInstance().importData(text);
      toast({
        title: "Data imported successfully",
        description: "Your data has been imported. You may need to refresh the page.",
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing your data.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await StorageService.getInstance().exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'habits-backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
      await StorageService.getInstance().clearAllData();
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
        <p className="text-sm text-muted-foreground">
          <AlertTriangle className="w-4 h-4 inline mr-2" />
          Your data is stored locally in your browser. Clear browser data/cache will delete all your habits data.
        </p>
      </CardContent>
    </Card>
  );
}
