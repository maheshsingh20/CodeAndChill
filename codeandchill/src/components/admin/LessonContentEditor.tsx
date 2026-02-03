import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Code,
  FileText,
  Video,
  Save,
  X,
  Edit,
  Eye,
  PlayCircle
} from "lucide-react";

interface CodeExample {
  language: string;
  code: string;
  description: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
  codeExamples?: CodeExample[];
  quiz?: QuizQuestion[];
}

interface LessonContentEditorProps {
  lesson: Lesson;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const programmingLanguages = [
  'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'c',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'dart', 'html', 'css', 'sql'
];

export function LessonContentEditor({ lesson, onSave, onCancel, isOpen }: LessonContentEditorProps) {
  const [editingLesson, setEditingLesson] = useState<Lesson>(lesson);
  const [activeTab, setActiveTab] = useState('content');

  const handleSave = () => {
    onSave(editingLesson);
  };

  const addCodeExample = () => {
    const newCodeExample: CodeExample = {
      language: 'javascript',
      code: '// Your code here\nconsole.log("Hello, World!");',
      description: 'Example description'
    };

    setEditingLesson({
      ...editingLesson,
      codeExamples: [...(editingLesson.codeExamples || []), newCodeExample]
    });
  };

  const updateCodeExample = (index: number, field: keyof CodeExample, value: string) => {
    const updatedExamples = [...(editingLesson.codeExamples || [])];
    updatedExamples[index] = { ...updatedExamples[index], [field]: value };
    setEditingLesson({ ...editingLesson, codeExamples: updatedExamples });
  };

  const removeCodeExample = (index: number) => {
    const updatedExamples = editingLesson.codeExamples?.filter((_, i) => i !== index) || [];
    setEditingLesson({ ...editingLesson, codeExamples: updatedExamples });
  };

  const addQuizQuestion = () => {
    const newQuestion: QuizQuestion = {
      question: 'What is the correct answer?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'Explanation for the correct answer'
    };

    setEditingLesson({
      ...editingLesson,
      quiz: [...(editingLesson.quiz || []), newQuestion]
    });
  };

  const updateQuizQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updatedQuiz = [...(editingLesson.quiz || [])];
    updatedQuiz[index] = { ...updatedQuiz[index], [field]: value };
    setEditingLesson({ ...editingLesson, quiz: updatedQuiz });
  };

  const updateQuizOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuiz = [...(editingLesson.quiz || [])];
    const updatedOptions = [...updatedQuiz[questionIndex].options];
    updatedOptions[optionIndex] = value;
    updatedQuiz[questionIndex] = { ...updatedQuiz[questionIndex], options: updatedOptions };
    setEditingLesson({ ...editingLesson, quiz: updatedQuiz });
  };

  const removeQuizQuestion = (index: number) => {
    const updatedQuiz = editingLesson.quiz?.filter((_, i) => i !== index) || [];
    setEditingLesson({ ...editingLesson, quiz: updatedQuiz });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Edit Lesson: {lesson.title}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Add rich content, code examples, videos, and quizzes to enhance the learning experience.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger value="content" className="text-white data-[state=active]:bg-gray-700">
                <FileText className="w-4 h-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger value="video" className="text-white data-[state=active]:bg-gray-700">
                <Video className="w-4 h-4 mr-2" />
                Video
              </TabsTrigger>
              <TabsTrigger value="code" className="text-white data-[state=active]:bg-gray-700">
                <Code className="w-4 h-4 mr-2" />
                Code Examples
              </TabsTrigger>
              <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-gray-700">
                <PlayCircle className="w-4 h-4 mr-2" />
                Quiz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-white">Lesson Title</Label>
                  <Input
                    id="title"
                    value={editingLesson.title}
                    onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={editingLesson.duration || ''}
                    onChange={(e) => setEditingLesson({ ...editingLesson, duration: parseInt(e.target.value) || 30 })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={editingLesson.description || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                  placeholder="Brief description of the lesson"
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content" className="text-white">Lesson Content (Markdown supported)</Label>
                <Textarea
                  id="content"
                  value={editingLesson.content || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })}
                  placeholder="Write your lesson content here. You can use Markdown formatting."
                  className="bg-gray-800 border-gray-600 text-white font-mono"
                  rows={15}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Supports Markdown: **bold**, *italic*, `code`, ```code blocks```, # headers, - lists, etc.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <div>
                <Label htmlFor="videoUrl" className="text-white">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={editingLesson.videoUrl || ''}
                  onChange={(e) => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Supports YouTube, Vimeo, and direct video file URLs
                </p>
              </div>

              {editingLesson.videoUrl && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Video Preview</h4>
                  <div className="aspect-video bg-gray-700 rounded flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Video className="w-12 h-12 mx-auto mb-2" />
                      <p>Video will be embedded here</p>
                      <p className="text-sm">{editingLesson.videoUrl}</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Code Examples</h3>
                <Button onClick={addCodeExample} size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Code Example
                </Button>
              </div>

              <div className="space-y-4">
                {editingLesson.codeExamples?.map((example, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white text-sm">Code Example {index + 1}</CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCodeExample(index)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-white text-xs">Language</Label>
                          <Select
                            value={example.language}
                            onValueChange={(value) => updateCodeExample(index, 'language', value)}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              {programmingLanguages.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-white text-xs">Description</Label>
                          <Input
                            value={example.description}
                            onChange={(e) => updateCodeExample(index, 'description', e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="What does this code do?"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-white text-xs">Code</Label>
                        <Textarea
                          value={example.code}
                          onChange={(e) => updateCodeExample(index, 'code', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                          rows={8}
                          placeholder="Enter your code here..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!editingLesson.codeExamples || editingLesson.codeExamples.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No code examples yet</p>
                    <p className="text-sm">Add code examples to help students understand the concepts</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="quiz" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Quiz Questions</h3>
                <Button onClick={addQuizQuestion} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-4">
                {editingLesson.quiz?.map((question, questionIndex) => (
                  <Card key={questionIndex} className="bg-gray-800 border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white text-sm">Question {questionIndex + 1}</CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeQuizQuestion(questionIndex)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-white text-xs">Question</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuizQuestion(questionIndex, 'question', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          rows={2}
                          placeholder="Enter your question here..."
                        />
                      </div>

                      <div>
                        <Label className="text-white text-xs">Options</Label>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <Badge
                                variant={optionIndex === question.correctAnswer ? "default" : "outline"}
                                className={optionIndex === question.correctAnswer ? "bg-green-600" : "border-gray-600"}
                              >
                                {String.fromCharCode(65 + optionIndex)}
                              </Badge>
                              <Input
                                value={option}
                                onChange={(e) => updateQuizOption(questionIndex, optionIndex, e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white flex-1"
                                placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                              />
                              <Button
                                size="sm"
                                variant={optionIndex === question.correctAnswer ? "default" : "outline"}
                                onClick={() => updateQuizQuestion(questionIndex, 'correctAnswer', optionIndex)}
                                className={optionIndex === question.correctAnswer ? "bg-green-600 hover:bg-green-700" : "border-gray-600 text-gray-400"}
                              >
                                {optionIndex === question.correctAnswer ? "Correct" : "Set Correct"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-white text-xs">Explanation (Optional)</Label>
                        <Textarea
                          value={question.explanation || ''}
                          onChange={(e) => updateQuizQuestion(questionIndex, 'explanation', e.target.value)}
                          className="bg-gray-700 border-gray-600 text-white"
                          rows={2}
                          placeholder="Explain why this is the correct answer..."
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!editingLesson.quiz || editingLesson.quiz.length === 0) && (
                  <div className="text-center py-8 text-gray-400">
                    <PlayCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No quiz questions yet</p>
                    <p className="text-sm">Add quiz questions to test student understanding</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button onClick={onCancel} variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-800">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save Lesson
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}