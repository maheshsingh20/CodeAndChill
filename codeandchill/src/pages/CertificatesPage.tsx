import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
      <div className="min-h-screen w-full bg-black p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent">Loading certificates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="text-yellow-400" size={40} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">My Certificates</h1>
          </div>
          <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-lg">
            Your achievements and completed courses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600/20 rounded-lg">
                  <Award className="text-purple-400" size={24} />
                </div>
                <div>
                  <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-sm">Total Certificates</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">{certificates.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600/20 rounded-lg">
                  <BookOpen className="text-green-400" size={24} />
                </div>
                <div>
                  <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-sm">Courses Completed</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                    {certificates.filter(c => c.certificateType === 'course').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-600/20 rounded-lg">
                  <Trophy className="text-yellow-400" size={24} />
                </div>
                <div>
                  <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-sm">Paths Completed</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent">
                    {certificates.filter(c => c.certificateType === 'path').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300">
            <div className="py-20 text-center p-6">
              <Award size={64} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent mb-2">No Certificates Yet</h3>
              <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent mb-6">
                Complete courses to earn certificates
              </p>
              <Button
                onClick={() => navigate('/learning-paths')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Browse Learning Paths
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div
                key={certificate._id}
                className="bg-gradient-to-br from-gray-900 via-black to-gray-800 backdrop-blur-sm border border-gray-700 hover:border-gray-600 rounded-md shadow-lg hover:shadow-xl hover:shadow-black/60 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                        <Award className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent text-lg font-bold">
                          {certificate.title}
                        </h3>
                        <p className="text-sm bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent mt-1">
                          {certificate.certificateType === 'course' ? 'Course' : 'Learning Path'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <p className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 bg-clip-text text-transparent text-sm mb-4">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
