import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ResumeData, ResumeUploadState } from '@/lib/resumeTypes';
import { processResumeWithAI } from '@/lib/ai';
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
} from 'lucide-react';

interface ResumeUploadProps {
  onResumeProcessed: (data: ResumeData) => void;
}

export function ResumeUpload({ onResumeProcessed }: ResumeUploadProps) {
  const [uploadState, setUploadState] = useState<ResumeUploadState>({
    isUploading: false,
    isProcessing: false,
    error: null,
    resumeData: null,
  });
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload a file smaller than 10MB.',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setUploadState((prev) => ({ ...prev, error: null }));
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setUploadState((prev) => ({ ...prev, error: null }));
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadState({
      isUploading: true,
      isProcessing: false,
      error: null,
      resumeData: null,
    });

    try {
      setUploadState((prev) => ({
        ...prev,
        isUploading: false,
        isProcessing: true,
      }));

      const data = await processResumeWithAI(selectedFile);

      setUploadState({
        isUploading: false,
        isProcessing: false,
        error: null,
        resumeData: data,
      });
      onResumeProcessed(data);
      toast({
        title: 'Resume processed successfully!',
        description: 'Your skills and experience have been extracted.',
      });
    } catch (error) {
      setUploadState({
        isUploading: false,
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Upload failed',
        resumeData: null,
      });
      toast({
        title: 'Processing failed',
        description: error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadState({
      isUploading: false,
      isProcessing: false,
      error: null,
      resumeData: null,
    });
  };

  const { isUploading, isProcessing, error, resumeData } = uploadState;
  const isLoading = isUploading || isProcessing;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Resume Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {!resumeData && (
          <>
            {/* File selected - show outside the drop zone */}
            {selectedFile && !isLoading ? (
              <div className="border-2 border-success bg-success/5 rounded-xl p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-8 h-8 text-success" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-2"
                      onClick={clearFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={handleUpload} className="gap-2">
                    <Upload className="w-4 h-4" /> Process Resume
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />

                {isLoading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-sm font-medium text-foreground">
                      {isUploading ? 'Uploading...' : 'Processing resume with AI...'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isProcessing && 'Extracting skills and experience'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="w-10 h-10 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Drop your resume here or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF files only, max 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Extracted Data Display */}
        {resumeData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Resume processed successfully!</span>
            </div>

            <div className="grid gap-3">
              {resumeData.name && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{resumeData.name}</span>
                </div>
              )}
              {resumeData.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{resumeData.email}</span>
                </div>
              )}
              {resumeData.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{resumeData.phone}</span>
                </div>
              )}
              {resumeData.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{resumeData.location}</span>
                </div>
              )}
            </div>

            {resumeData.experience && resumeData.experience.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Experience
                </div>
                <div className="pl-6 space-y-2">
                  {resumeData.experience.slice(0, 2).map((exp, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium">{exp.title}</p>
                      <p className="text-muted-foreground">
                        {exp.company} • {exp.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeData.education && resumeData.education.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Education
                </div>
                <div className="pl-6 space-y-1">
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-muted-foreground">
                        {edu.institution} • {edu.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeData.extractedSkills && resumeData.extractedSkills.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Code className="w-4 h-4 text-primary" />
                  Extracted Skills
                </div>
                <div className="flex flex-wrap gap-2 pl-6">
                  {resumeData.extractedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                    >
                      {skill.name}
                      {skill.yearsOfExperience && ` (${skill.yearsOfExperience}y)`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" onClick={clearFile} className="w-full mt-2">
              Upload New Resume
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
