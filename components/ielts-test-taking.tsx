"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Send,
  Loader2
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  ieltsAPI, 
  IELTSTest, 
  IELTSSection, 
  IELTSQuestion,
  IELTSTestSubmission
} from "@/lib/api"

interface IELTSTestTakingProps {
  token: string
  test: IELTSTest
  submissionId?: string
  onBack: () => void
  onTestCompleted: (submissionId: string) => void
}

export function IELTSTestTaking({ token, test, submissionId: initialSubmissionId, onBack, onTestCompleted }: IELTSTestTakingProps) {
  const { toast } = useToast()
  const [submissionId, setSubmissionId] = useState<string>(initialSubmissionId || "")
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(test.duration * 60) // Convert to seconds
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(0)
  const [isStarted, setIsStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date())
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const sectionTimerRef = useRef<NodeJS.Timeout | null>(null)
  const saveAnswerTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const currentSection = test.sections?.[currentSectionIndex]
  const currentQuestion = currentSection?.questions?.[currentQuestionIndex]
  const totalQuestions = test.sections?.reduce((sum, section) => sum + (section.questions?.length || 0), 0) || 0
  const answeredQuestions = Object.keys(answers).length

  // Initialize section timer when section changes
  // Auto-start if submissionId is already provided
  useEffect(() => {
    if (submissionId && !isStarted) {
      setIsStarted(true)
      setQuestionStartTime(new Date())
      startTimers()
    }
  }, [submissionId])

  useEffect(() => {
    if (isStarted && currentSection) {
      setSectionTimeRemaining(currentSection.timeLimit * 60)
    }
  }, [currentSectionIndex, isStarted, currentSection])

  // Start the test (only for new submissions without submissionId)
  const handleStartTest = async () => {
    if (submissionId) {
      // Already have submission, just start the test
      setIsStarted(true)
      setQuestionStartTime(new Date())
      startTimers()
      return
    }

    setIsLoading(true)
    try {
      const result = await ieltsAPI.startTest(token, test._id!)
      if (result.success && result.data) {
        setSubmissionId(result.data.submissionId)
        setIsStarted(true)
        setQuestionStartTime(new Date())
        startTimers()
        toast({
          title: "Test Started",
          description: "Good luck with your IELTS test!",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to start test",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Timer functions
  const startTimers = () => {
    // Main timer
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Section timer
    sectionTimerRef.current = setInterval(() => {
      setSectionTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto move to next section
          if (test.sections && currentSectionIndex < test.sections.length - 1) {
            handleNextSection()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (sectionTimerRef.current) {
      clearInterval(sectionTimerRef.current)
      sectionTimerRef.current = null
    }
    if (saveAnswerTimeoutRef.current) {
      clearTimeout(saveAnswerTimeoutRef.current)
      saveAnswerTimeoutRef.current = null
    }
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => stopTimers()
  }, [])

  // Save answer
  const handleAnswerChange = (value: string) => {
    const questionKey = `${currentSectionIndex}-${currentQuestionIndex}`
    setAnswers(prev => ({ ...prev, [questionKey]: value }))

    // Clear existing timeout
    if (saveAnswerTimeoutRef.current) {
      clearTimeout(saveAnswerTimeoutRef.current)
    }

    // Set new timeout to save after 1 second of no typing
    saveAnswerTimeoutRef.current = setTimeout(async () => {
      if (submissionId && currentQuestion) {
        const timeSpent = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000)
        
        try {
          await ieltsAPI.saveAnswer(token, submissionId, {
            questionNumber: currentQuestion.questionNumber,
            sectionType: currentSection?.sectionType || '',
            answer: value,
            timeSpent
          })
        } catch (error) {
          console.error("Failed to save answer:", error)
        }
      }
    }, 1000) // 1 second debounce
  }

  // Force save current answer (used when navigating)
  const forceSaveCurrentAnswer = async () => {
    if (saveAnswerTimeoutRef.current) {
      clearTimeout(saveAnswerTimeoutRef.current)
      saveAnswerTimeoutRef.current = null
    }

    const questionKey = `${currentSectionIndex}-${currentQuestionIndex}`
    const currentAnswer = answers[questionKey]
    
    if (submissionId && currentQuestion && currentAnswer) {
      const timeSpent = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000)
      
      try {
        await ieltsAPI.saveAnswer(token, submissionId, {
          questionNumber: currentQuestion.questionNumber,
          sectionType: currentSection?.sectionType || '',
          answer: currentAnswer,
          timeSpent
        })
      } catch (error) {
        console.error("Failed to force save answer:", error)
      }
    }
  }

  // Navigation functions
  const handlePrevQuestion = async () => {
    await forceSaveCurrentAnswer()
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setQuestionStartTime(new Date())
    } else if (currentSectionIndex > 0 && test.sections) {
      setCurrentSectionIndex(currentSectionIndex - 1)
      setCurrentQuestionIndex(test.sections[currentSectionIndex - 1]?.questions?.length - 1 || 0)
      setQuestionStartTime(new Date())
    }
  }

  const handleNextQuestion = async () => {
    await forceSaveCurrentAnswer()
    
    if (currentQuestionIndex < currentSection?.questions?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setQuestionStartTime(new Date())
    } else if (test.sections && currentSectionIndex < test.sections.length - 1) {
      handleNextSection()
    }
  }

  const handleNextSection = async () => {
    await forceSaveCurrentAnswer()
    
    if (test.sections && currentSectionIndex < test.sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
      setCurrentQuestionIndex(0)
      setQuestionStartTime(new Date())
    }
  }

  const handleQuestionJump = async (sectionIndex: number, questionIndex: number) => {
    await forceSaveCurrentAnswer()
    
    setCurrentSectionIndex(sectionIndex)
    setCurrentQuestionIndex(questionIndex)
    setQuestionStartTime(new Date())
  }

  // Submit test
  const handleSubmitTest = async () => {
    // Force save current answer before submitting
    await forceSaveCurrentAnswer()
    
    setIsLoading(true)
    stopTimers()
    
    try {
      const result = await ieltsAPI.submitTest(token, submissionId)
      if (result.success && result.data) {
        toast({
          title: "Test Submitted",
          description: "Your test has been submitted successfully!",
        })
        onTestCompleted(submissionId)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit test",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Get current answer
  const getCurrentAnswer = () => {
    const questionKey = `${currentSectionIndex}-${currentQuestionIndex}`
    return answers[questionKey] || ""
  }

  // Render question based on type
  const renderQuestion = () => {
    if (!currentQuestion) return null

    const currentAnswer = getCurrentAnswer()

    switch (currentQuestion.questionType) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <p className="text-lg">{currentQuestion.questionText}</p>
            {currentQuestion.audioUrl && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <audio controls className="w-full">
                  <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <label key={option.optionId} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentSectionIndex}-${currentQuestionIndex}`}
                    value={option.optionId}
                    checked={currentAnswer === option.optionId}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="flex-1">{option.optionId.toUpperCase()}. {option.text}</span>
                </label>
              ))}
            </div>
          </div>
        )

      case 'fill-blank':
      case 'short-answer':
        return (
          <div className="space-y-4">
            <p className="text-lg">{currentQuestion.questionText}</p>
            {currentQuestion.audioUrl && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <audio controls className="w-full">
                  <source src={currentQuestion.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            <Input
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              className="text-lg"
            />
          </div>
        )

      case 'true-false':
        return (
          <div className="space-y-4">
            <p className="text-lg">{currentQuestion.questionText}</p>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${currentSectionIndex}-${currentQuestionIndex}`}
                  value="true"
                  checked={currentAnswer === "true"}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-4 h-4"
                />
                <span>True</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${currentSectionIndex}-${currentQuestionIndex}`}
                  value="false"
                  checked={currentAnswer === "false"}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-4 h-4"
                />
                <span>False</span>
              </label>
            </div>
          </div>
        )

      case 'essay':
        return (
          <div className="space-y-4">
            <p className="text-lg">{currentQuestion.questionText}</p>
            <Textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Write your essay here..."
              rows={15}
              className="min-h-[300px]"
            />
            <div className="text-sm text-muted-foreground">
              Word count: {currentAnswer.split(/\s+/).filter(word => word.length > 0).length}
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <p className="text-lg">{currentQuestion.questionText}</p>
            <Textarea
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              rows={5}
            />
          </div>
        )
    }
  }

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {test.title}
              <Badge variant="outline">{test.level}</Badge>
            </CardTitle>
            <CardDescription>{test.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="font-semibold">{formatTime(test.duration * 60)}</div>
                <div className="text-sm text-muted-foreground">Total Duration</div>
              </div>
              <div className="text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="font-semibold">{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="font-semibold">{test.passingScore}</div>
                <div className="text-sm text-muted-foreground">Passing Score</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Test Sections:</h3>
              <div className="space-y-2">
                {test.sections && test.sections.length > 0 ? (
                  test.sections.map((section, index) => (
                    <div key={index} className="flex items-center justify-between border rounded p-3">
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {section.sectionType} • {section.questions?.length || 0} questions
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {formatTime(section.timeLimit * 60)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No sections available</div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Important Instructions:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Once started, the timer cannot be paused</li>
                <li>Your answers are automatically saved as you type</li>
                <li>You can navigate between questions freely</li>
                <li>Make sure you have a stable internet connection</li>
                <li>Submit the test before time runs out</li>
              </ul>
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleStartTest}
                disabled={isLoading}
                className="px-8"
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Play className="w-4 h-4 mr-2" />
                Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Safety check for sections and questions
  if (!test.sections || test.sections.length === 0 || !currentSection || !currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Test Data Unavailable</h2>
              <p className="text-muted-foreground">
                This test does not have valid sections or questions. Please contact support or try another test.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">{test.title}</h1>
              <Badge variant="outline" className="capitalize">
                {currentSection.sectionType}
              </Badge>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Section Time</div>
                <div className={`font-mono font-semibold ${sectionTimeRemaining < 300 ? 'text-red-600' : ''}`}>
                  {formatTime(sectionTimeRemaining)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Total Time</div>
                <div className={`font-mono font-semibold ${timeRemaining < 1800 ? 'text-red-600' : ''}`}>
                  {formatTime(timeRemaining)}
                </div>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setShowSubmitDialog(true)}
                disabled={isLoading}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Test
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Questions</CardTitle>
              <CardDescription>
                {answeredQuestions} of {totalQuestions} answered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress 
                value={(answeredQuestions / totalQuestions) * 100} 
                className="mb-4"
              />
              <div className="space-y-4">
                {test.sections && test.sections.length > 0 ? (
                  test.sections.map((section, sectionIdx) => (
                    <div key={sectionIdx}>
                      <h4 className="font-medium text-sm mb-2 capitalize">
                        {section.sectionType}
                      </h4>
                      <div className="grid grid-cols-5 gap-1">
                        {section.questions && section.questions.length > 0 ? (
                          section.questions.map((_, questionIdx) => {
                            const questionKey = `${sectionIdx}-${questionIdx}`
                            const isAnswered = answers[questionKey]
                            const isCurrent = sectionIdx === currentSectionIndex && questionIdx === currentQuestionIndex
                            
                            return (
                              <button
                                key={questionIdx}
                                onClick={() => handleQuestionJump(sectionIdx, questionIdx)}
                                className={`
                                  w-8 h-8 rounded text-xs font-medium transition-colors
                                  ${isCurrent 
                                    ? 'bg-blue-600 text-white' 
                                    : isAnswered 
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                    : 'bg-gray-100 hover:bg-gray-200'
                                  }
                                `}
                              >
                                {questionIdx + 1}
                              </button>
                            )
                          })
                        ) : (
                          <div className="text-xs text-muted-foreground">No questions</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted-foreground">No sections available</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Question Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Question {currentQuestionIndex + 1} of {currentSection.questions.length}
                  </CardTitle>
                  <CardDescription>
                    Section {currentSectionIndex + 1}: {currentSection.title} • {currentQuestion?.points} point(s)
                  </CardDescription>
                </div>
                <Badge variant="outline" className="capitalize">
                  {currentQuestion?.questionType.replace('-', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderQuestion()}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevQuestion}
                  disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="text-sm text-muted-foreground">
                  Question {test.sections?.slice(0, currentSectionIndex).reduce((sum, section) => sum + (section.questions?.length || 0), 0) + currentQuestionIndex + 1} of {totalQuestions}
                </div>

                <Button
                  onClick={handleNextQuestion}
                  disabled={!test.sections || !currentSection || (currentSectionIndex === test.sections.length - 1 && currentQuestionIndex === (currentSection.questions?.length || 1) - 1)}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Test?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to submit your test? This action cannot be undone.</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Questions Answered:</strong> {answeredQuestions} of {totalQuestions}
              </div>
              <div>
                <strong>Time Remaining:</strong> {formatTime(timeRemaining)}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitTest} disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Test
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
