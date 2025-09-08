"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Plus, Minus, Loader2, Save, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel } from "@/components/ui/accordion"
import { ieltsAPI, IELTSTest, IELTSSection, IELTSQuestion, IELTSOption } from "@/lib/api"

interface IELTSTestFormProps {
  token: string
  onBack: () => void
  onTestCreated: () => void
  editTest?: IELTSTest | null
}

export function IELTSTestForm({ token, onBack, onTestCreated, editTest }: IELTSTestFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [test, setTest] = useState<Omit<IELTSTest, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'>>({
    title: editTest?.title || "",
    description: editTest?.description || "",
    level: editTest?.level || "intermediate",
    testType: editTest?.testType || "full-test",
    duration: editTest?.duration || 180,
    passingScore: editTest?.passingScore || 25,
    sections: editTest?.sections || [],
    isActive: editTest?.isActive !== false
  })

  const handleTestChange = (field: string, value: any) => {
    setTest(prev => ({ ...prev, [field]: value }))
  }

  const addSection = () => {
    const newSection: IELTSSection = {
      sectionType: "listening",
      sectionNumber: test.sections.length + 1,
      title: `Section ${test.sections.length + 1}`,
      timeLimit: 30,
      questions: []
    }
    setTest(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }))
  }

  const updateSection = (index: number, field: string, value: any) => {
    setTest(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }))
  }

  const removeSection = (index: number) => {
    setTest(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }))
  }

  const addQuestion = (sectionIndex: number) => {
    const newQuestion: IELTSQuestion = {
      questionNumber: test.sections[sectionIndex].questions.length + 1,
      questionType: "multiple-choice",
      questionText: "",
      options: [
        { optionId: "a", text: "" },
        { optionId: "b", text: "" },
        { optionId: "c", text: "" },
        { optionId: "d", text: "" }
      ],
      correctAnswer: "a",
      points: 1
    }

    setTest(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, questions: [...section.questions, newQuestion] }
          : section
      )
    }))
  }

  const updateQuestion = (sectionIndex: number, questionIndex: number, field: string, value: any) => {
    setTest(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? {
              ...section,
              questions: section.questions.map((question, j) => 
                j === questionIndex ? { ...question, [field]: value } : question
              )
            }
          : section
      )
    }))
  }

  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    setTest(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? { ...section, questions: section.questions.filter((_, j) => j !== questionIndex) }
          : section
      )
    }))
  }

  const updateQuestionOption = (sectionIndex: number, questionIndex: number, optionIndex: number, field: string, value: string) => {
    setTest(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === sectionIndex 
          ? {
              ...section,
              questions: section.questions.map((question, j) => 
                j === questionIndex 
                  ? {
                      ...question,
                      options: question.options?.map((option, k) => 
                        k === optionIndex ? { ...option, [field]: value } : option
                      )
                    }
                  : question
              )
            }
          : section
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editTest) {
        await ieltsAPI.admin.updateTest(token, editTest._id!, test)
        toast({
          title: "Success",
          description: "Test updated successfully",
        })
      } else {
        await ieltsAPI.admin.createTest(token, test)
        toast({
          title: "Success", 
          description: "Test created successfully",
        })
      }
      onTestCreated()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save test",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </Button>
        <h2 className="text-2xl font-bold">
          {editTest ? 'Edit IELTS Test' : 'Create New IELTS Test'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Information</CardTitle>
            <CardDescription>Basic information about the IELTS test</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Test Title</Label>
                <Input
                  id="title"
                  value={test.title}
                  onChange={(e) => handleTestChange('title', e.target.value)}
                  placeholder="e.g., IELTS Practice Test 1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <Select value={test.level} onValueChange={(value) => handleTestChange('level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={test.description}
                onChange={(e) => handleTestChange('description', e.target.value)}
                placeholder="Describe the test content and objectives"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="testType">Test Type</Label>
                <Select value={test.testType} onValueChange={(value) => handleTestChange('testType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-test">Full Test</SelectItem>
                    <SelectItem value="listening-only">Listening Only</SelectItem>
                    <SelectItem value="reading-only">Reading Only</SelectItem>
                    <SelectItem value="writing-only">Writing Only</SelectItem>
                    <SelectItem value="speaking-only">Speaking Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={test.duration}
                  onChange={(e) => handleTestChange('duration', parseInt(e.target.value))}
                  min="1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="passingScore">Passing Score</Label>
                <Input
                  id="passingScore"
                  type="number"
                  value={test.passingScore}
                  onChange={(e) => handleTestChange('passingScore', parseInt(e.target.value))}
                  min="1"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Test Sections
              <Button type="button" onClick={addSection} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </CardTitle>
            <CardDescription>Configure test sections and questions</CardDescription>
          </CardHeader>
          <CardContent>
            {test.sections.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No sections added yet. Click "Add Section" to start.
              </p>
            ) : (
              <div className="space-y-4">
                {test.sections.map((section, sectionIndex) => (
                  <Accordion key={sectionIndex}>
                    <AccordionItem value={`section-${sectionIndex}`}>
                      <AccordionHeader className="hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <span>{section.title || `Section ${sectionIndex + 1}`}</span>
                          <Button 
                            type="button"
                            variant="destructive" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSection(sectionIndex)
                            }}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        </div>
                      </AccordionHeader>
                      <AccordionPanel className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Section Type</Label>
                          <Select 
                            value={section.sectionType} 
                            onValueChange={(value) => updateSection(sectionIndex, 'sectionType', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="listening">Listening</SelectItem>
                              <SelectItem value="reading">Reading</SelectItem>
                              <SelectItem value="writing">Writing</SelectItem>
                              <SelectItem value="speaking">Speaking</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Section Title</Label>
                          <Input
                            value={section.title}
                            onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                            placeholder="Section title"
                          />
                        </div>
                        <div>
                          <Label>Time Limit (minutes)</Label>
                          <Input
                            type="number"
                            value={section.timeLimit}
                            onChange={(e) => updateSection(sectionIndex, 'timeLimit', parseInt(e.target.value))}
                            min="1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={section.description || ""}
                          onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                          placeholder="Section description (optional)"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Questions</h4>
                          <Button 
                            type="button"
                            onClick={() => addQuestion(sectionIndex)} 
                            size="sm"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Question
                          </Button>
                        </div>

                        {section.questions.map((question, questionIndex) => (
                          <Card key={questionIndex} className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium">Question {questionIndex + 1}</h5>
                                <Button 
                                  type="button"
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => removeQuestion(sectionIndex, questionIndex)}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Question Type</Label>
                                  <Select 
                                    value={question.questionType} 
                                    onValueChange={(value) => updateQuestion(sectionIndex, questionIndex, 'questionType', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                      <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                                      <SelectItem value="true-false">True/False</SelectItem>
                                      <SelectItem value="matching">Matching</SelectItem>
                                      <SelectItem value="short-answer">Short Answer</SelectItem>
                                      <SelectItem value="essay">Essay</SelectItem>
                                      <SelectItem value="speaking">Speaking</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Points</Label>
                                  <Input
                                    type="number"
                                    value={question.points}
                                    onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'points', parseInt(e.target.value))}
                                    min="1"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label>Question Text</Label>
                                <Textarea
                                  value={question.questionText}
                                  onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'questionText', e.target.value)}
                                  placeholder="Enter the question text"
                                  rows={3}
                                />
                              </div>

                              {question.questionType === 'multiple-choice' && (
                                <div className="space-y-3">
                                  <Label>Answer Options</Label>
                                  {question.options?.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                      <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                                        {option.optionId.toUpperCase()}
                                      </span>
                                      <Input
                                        value={option.text}
                                        onChange={(e) => updateQuestionOption(sectionIndex, questionIndex, optionIndex, 'text', e.target.value)}
                                        placeholder={`Option ${option.optionId.toUpperCase()}`}
                                        className="flex-1"
                                      />
                                    </div>
                                  ))}
                                  <div>
                                    <Label>Correct Answer</Label>
                                    <Select 
                                      value={question.correctAnswer} 
                                      onValueChange={(value) => updateQuestion(sectionIndex, questionIndex, 'correctAnswer', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {question.options?.map((option) => (
                                          <SelectItem key={option.optionId} value={option.optionId}>
                                            {option.optionId.toUpperCase()}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}

                              {(question.questionType === 'fill-blank' || question.questionType === 'short-answer') && (
                                <div>
                                  <Label>Correct Answer</Label>
                                  <Input
                                    value={question.correctAnswer || ""}
                                    onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'correctAnswer', e.target.value)}
                                    placeholder="Enter the correct answer"
                                  />
                                </div>
                              )}

                              {section.sectionType === 'listening' && (
                                <div>
                                  <Label>Audio URL (optional)</Label>
                                  <Input
                                    value={question.audioUrl || ""}
                                    onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'audioUrl', e.target.value)}
                                    placeholder="https://example.com/audio.mp3"
                                  />
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Save className="w-4 h-4 mr-2" />
            {editTest ? 'Update Test' : 'Create Test'}
          </Button>
        </div>
      </form>
    </div>
  )
}
