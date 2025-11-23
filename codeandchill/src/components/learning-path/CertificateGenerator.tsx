import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2, Award } from 'lucide-react';

interface CertificateGeneratorProps {
  userName: string;
  pathTitle: string;
  completionDate: Date;
  pathId: string;
}

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
  userName,
  pathTitle,
  completionDate,
  pathId
}) => {
  const handleDownload = () => {
    // TODO: Implement certificate download as PDF
    console.log('Downloading certificate...');
  };

  const handleShare = () => {
    // TODO: Implement certificate sharing
    console.log('Sharing certificate...');
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30">
      <CardContent className="p-8">
        <div className="bg-white rounded-lg p-12 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>
          
          <Award size={64} className="mx-auto text-purple-600 mb-6" />
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Certificate of Completion</h2>
          <p className="text-gray-600 mb-8">This certifies that</p>
          
          <h3 className="text-4xl font-bold text-purple-600 mb-8">{userName}</h3>
          
          <p className="text-gray-600 mb-4">has successfully completed</p>
          <h4 className="text-2xl font-semibold text-gray-800 mb-8">{pathTitle}</h4>
          
          <p className="text-gray-600 mb-2">Completion Date</p>
          <p className="text-lg font-semibold text-gray-800 mb-8">
            {completionDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-8 border-t border-gray-300">
            <div className="text-center">
              <div className="w-32 h-1 bg-gray-800 mb-2"></div>
              <p className="text-sm text-gray-600">Instructor Signature</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-1 bg-gray-800 mb-2"></div>
              <p className="text-sm text-gray-600">Platform Director</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700">
            <Download size={16} className="mr-2" />
            Download Certificate
          </Button>
          <Button onClick={handleShare} variant="outline" className="border-gray-600">
            <Share2 size={16} className="mr-2" />
            Share on LinkedIn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
