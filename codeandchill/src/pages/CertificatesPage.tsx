import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Share2, Calendar, BookOpen, Trophy } from 'lucide-react';
import { LearningPathService } from '@/services/learningPathService';

interface Certificate {
  _id: string;
  userId: string;
  courseId: {
    _id: string;
    courseTitle: string;
  };
  learningPathId: {
    _id: string;
    title: string;
    icon: string;
  };
  certificateType: 'course' | 'path';
  title: string;
  description: string;
  certificateId: string;
  completionDate: string;
  issuedAt: string;
  skills: string[];
}

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await LearningPathService.getUserCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full relative p-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading certificates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative p-8">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-yellow-400" size={40} />
            <h1 className="text-4xl font-bold text-white">My Certificates</h1>
          </div>
          <p className="text-gray-400 text-lg">
            Your achievements and completed courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600/20 rounded-lg">
                  <Award className="text-purple-400" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Certificates</p>
                  <p className="text-2xl font-bold text-white">{certificates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600/20 rounded-lg">
                  <BookOpen className="text-green-400" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Courses Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {certificates.filter(c => c.certificateType === 'course').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-600/20 rounded-lg">
                  <Trophy className="text-yellow-400" size={24} />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Paths Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {certificates.filter(c => c.certificateType === 'path').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {certificates.length === 0 ? (
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
            <CardContent className="py-20 text-center">
              <Award size={64} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Certificates Yet</h3>
              <p className="text-gray-400 mb-6">
                Complete courses to earn certificates
              </p>
              <Button
                onClick={() => window.location.href = '/learning-paths'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Browse Learning Paths
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <Card
                key={certificate._id}
                className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-purple-500/50 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                        <Award className="text-white" size={24} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">
                          {certificate.title}
                        </CardTitle>
                        <p className="text-sm text-gray-400 mt-1">
                          {certificate.certificateType === 'course' ? 'Course' : 'Learning Path'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4">
                    {certificate.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar size={14} />
                    <span>
                      Completed {new Date(certificate.completionDate).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 mt-4 text-center">
                    ID: {certificate.certificateId}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
