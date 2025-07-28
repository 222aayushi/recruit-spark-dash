import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Upload, FileText, Database, Globe, Plus } from 'lucide-react';
import { DataSet, UploadProgress } from '@/types/data';
import { DataProcessor } from '@/utils/dataProcessing';
import { FirecrawlService } from '@/utils/FirecrawlService';

interface DataUploadProps {
  onDataUploaded: (dataSet: DataSet) => void;
}

export const DataUpload = ({ onDataUploaded }: DataUploadProps) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [crawlUrl, setCrawlUrl] = useState('');
  const [firecrawlApiKey, setFirecrawlApiKey] = useState('');

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setUploadProgress({
      stage: 'uploading',
      progress: 0,
      message: 'Uploading file...'
    });

    try {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'csv') {
        setUploadProgress({
          stage: 'parsing',
          progress: 30,
          message: 'Parsing CSV file...'
        });

        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setUploadProgress({
              stage: 'analyzing',
              progress: 70,
              message: 'Analyzing data quality...'
            });

            const dataSet = DataProcessor.analyzeData(
              results.data as any[],
              file.name.replace('.csv', ''),
              'csv'
            );

            setTimeout(() => {
              setUploadProgress({
                stage: 'complete',
                progress: 100,
                message: 'Upload complete!'
              });
              
              onDataUploaded(dataSet);
              toast({
                title: "File uploaded successfully",
                description: `${dataSet.rowCount} rows, ${dataSet.columnCount} columns`,
              });
              
              setTimeout(() => {
                setUploadProgress(null);
                setIsProcessing(false);
              }, 1000);
            }, 500);
          },
          error: (error) => {
            toast({
              title: "Error parsing CSV",
              description: error.message,
              variant: "destructive",
            });
            setIsProcessing(false);
            setUploadProgress(null);
          }
        });
      } else if (fileType === 'json') {
        setUploadProgress({
          stage: 'parsing',
          progress: 30,
          message: 'Parsing JSON file...'
        });

        const text = await file.text();
        const jsonData = JSON.parse(text);
        const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];

        setUploadProgress({
          stage: 'analyzing',
          progress: 70,
          message: 'Analyzing data quality...'
        });

        const dataSet = DataProcessor.analyzeData(
          dataArray,
          file.name.replace('.json', ''),
          'json'
        );

        setTimeout(() => {
          setUploadProgress({
            stage: 'complete',
            progress: 100,
            message: 'Upload complete!'
          });
          
          onDataUploaded(dataSet);
          toast({
            title: "File uploaded successfully",
            description: `${dataSet.rowCount} rows, ${dataSet.columnCount} columns`,
          });
          
          setTimeout(() => {
            setUploadProgress(null);
            setIsProcessing(false);
          }, 1000);
        }, 500);
      } else {
        throw new Error('Unsupported file type. Please upload CSV or JSON files.');
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setIsProcessing(false);
      setUploadProgress(null);
    }
  }, [onDataUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0]);
      }
    }, [processFile]),
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    multiple: false,
    disabled: isProcessing
  });

  const handleWebCrawl = async () => {
    if (!crawlUrl) {
      toast({
        title: "Error",
        description: "Please enter a website URL",
        variant: "destructive",
      });
      return;
    }

    if (!firecrawlApiKey) {
      toast({
        title: "Error",
        description: "Please enter your Firecrawl API key",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setUploadProgress({
      stage: 'uploading',
      progress: 0,
      message: 'Crawling website...'
    });

    try {
      FirecrawlService.saveApiKey(firecrawlApiKey);
      const result = await FirecrawlService.crawlWebsite(crawlUrl);
      
      if (result.success && result.data) {
        setUploadProgress({
          stage: 'analyzing',
          progress: 70,
          message: 'Processing crawled data...'
        });

        // Convert crawled data to tabular format
        const processedData = Array.isArray(result.data.data) 
          ? result.data.data.map((item: any, index: number) => ({
              id: index + 1,
              url: item.metadata?.sourceURL || crawlUrl,
              title: item.metadata?.title || 'N/A',
              content_length: item.markdown?.length || 0,
              word_count: item.markdown?.split(' ').length || 0,
              crawled_at: new Date().toISOString(),
            }))
          : [];

        const dataSet = DataProcessor.analyzeData(
          processedData,
          `Web Crawl: ${new URL(crawlUrl).hostname}`,
          'web'
        );

        setUploadProgress({
          stage: 'complete',
          progress: 100,
          message: 'Crawl complete!'
        });

        onDataUploaded(dataSet);
        toast({
          title: "Website crawled successfully",
          description: `${dataSet.rowCount} pages processed`,
        });

        setCrawlUrl('');
      } else {
        throw new Error(result.error || 'Failed to crawl website');
      }
    } catch (error) {
      toast({
        title: "Crawl failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress(null), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <Card className="border-glass bg-glass backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Data Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50'
            } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                {isProcessing ? (
                  <Database className="h-12 w-12 text-primary animate-pulse" />
                ) : (
                  <FileText className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-lg font-medium">
                  {isDragActive
                    ? 'Drop your file here'
                    : isProcessing
                    ? 'Processing...'
                    : 'Drag & drop your data file'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Supports CSV and JSON files up to 10MB
                </p>
              </div>
              {!isProcessing && (
                <Button variant="outline" className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              )}
            </div>
          </div>

          {uploadProgress && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize">{uploadProgress.stage}</span>
                <span>{uploadProgress.progress}%</span>
              </div>
              <Progress value={uploadProgress.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{uploadProgress.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Web Crawling */}
      <Card className="border-glass bg-glass backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Web Data Crawling
            <Badge variant="secondary" className="ml-auto">Beta</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Firecrawl API Key</label>
            <Input
              type="password"
              placeholder="Enter your Firecrawl API key"
              value={firecrawlApiKey}
              onChange={(e) => setFirecrawlApiKey(e.target.value)}
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from <a href="https://firecrawl.dev" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">firecrawl.dev</a>
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Website URL</label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com"
                value={crawlUrl}
                onChange={(e) => setCrawlUrl(e.target.value)}
                disabled={isProcessing}
              />
              <Button 
                onClick={handleWebCrawl}
                disabled={isProcessing || !crawlUrl || !firecrawlApiKey}
              >
                Crawl
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};