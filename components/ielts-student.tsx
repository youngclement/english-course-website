"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { 
  Search, 
  Play, 
  Clock, 
  BookOpen, 
  TrendingUp, 
  Award,
  Calendar,
  Filter,
  Eye,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ieltsAPI, 
  IELTSTest, 
  IELTSTestSubmission, 
  IELTSTestsResponse, 
  IELTSSubmissionsResponse 
} from "@/lib/api"
import { IELTSTestTaking } from "./ielts-test-taking"
import { IELTSTestResults } from "./ielts-test-results"

interface IELTSStudentProps {
  token: string
}

export function IELTSStudent({ token }: IELTSStudentProps) {
  const { toast } = useToast()
  const [currentView, setCurrentView] = useState<'dashboard' | 'tests' | 'history' | 'taking-test' | 'results'>('dashboard')
  const [isLoading, setIsLoading] = useState(false)
  
  // Data states
  const [tests, setTests] = useState<IELTSTest[]>([])
  const [history, setHistory] = useState<IELTSTestSubmission[]>([])
  const [selectedTest, setSelectedTest] = useState<IELTSTest | null>(null)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>("")
  
  // Pagination and filters
  const [testsPagination, setTestsPagination] = useState<any>(null)
  const [historyPagination, setHistoryPagination] = useState<any>(null)
  const [currentTestsPage, setCurrentTestsPage] = useState(1)
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [testTypeFilter, setTestTypeFilter] = useState("all")

  // Load data based on current view
  useEffect(() => {
    if (currentView === 'tests') {
      loadTests()
    } else if (currentView === 'history') {
      loadHistory()
    }
  }, [currentView, currentTestsPage, currentHistoryPage, levelFilter, testTypeFilter])

  const loadTests = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page: currentTestsPage,
        limit: 10,
        isActive: true
      }
      if (levelFilter !== 'all') params.level = levelFilter
      if (testTypeFilter !== 'all') params.testType = testTypeFilter

      const result = await ieltsAPI.getTests(token, params)
      if (result.success && result.data) {
        setTests(result.data.tests)
        setTestsPagination(result.data.pagination)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load tests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page: currentHistoryPage,
        limit: 10
      }

      const result = await ieltsAPI.getTestHistory(token, params)
      if (result.success && result.data) {
        setHistory(result.data.submissions)
        setHistoryPagination(result.data.pagination)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load test history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartTest = async (test: IELTSTest) => {
    if (!token || !test._id) return

    try {
      setIsLoading(true)
      
      // First, get full test data from the list (which should have sections/questions)
      let fullTestData = test
      
      // Check if current test object has sections - if not, try to get from tests list
      if (!test.sections || test.sections.length === 0) {
        const testFromList = tests.find(t => t._id === test._id)
        if (testFromList && testFromList.sections && testFromList.sections.length > 0) {
          fullTestData = testFromList
        } else {
          // If still no sections, fetch from getTestDetails
          const testDetailsResult = await ieltsAPI.getTestDetails(token, test._id)
          if (testDetailsResult.success && testDetailsResult.data) {
            fullTestData = testDetailsResult.data.test
          }
        }
      }
      
      // Debug log to check test data
      console.log("Final test data:", fullTestData)
      console.log("Test sections:", fullTestData.sections)
      
      // Check for ongoing submission
      const testDetailsResult = await ieltsAPI.getTestDetails(token, test._id)
      
      if (testDetailsResult.success && testDetailsResult.data) {
        const { hasOngoingSubmission, ongoingSubmissionId } = testDetailsResult.data
        
        if (hasOngoingSubmission && ongoingSubmissionId) {
          const confirm = window.confirm(
            "You have an ongoing submission for this test. Do you want to continue where you left off?"
          )
          if (confirm) {
            // Continue with existing submission
            setSelectedTest(fullTestData)
            setSelectedSubmissionId(ongoingSubmissionId)
            setCurrentView('taking-test')
            return
          }
        }
        
        // Start new test session
        const startResult = await ieltsAPI.startTest(token, test._id)
        
        if (startResult.success && startResult.data) {
          const attemptMessage = startResult.data.attemptNumber 
            ? `Started attempt #${startResult.data.attemptNumber}`
            : "Continuing existing test session"
            
          toast({
            title: "Test started!",
            description: attemptMessage,
          })
          
          setSelectedTest(fullTestData) // Use full test data with questions
          setSelectedSubmissionId(startResult.data.submissionId)
          setCurrentView('taking-test')
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to start test",
          })
        }
      }
    } catch (error) {
      console.error("Error starting test:", error)
      toast({
        variant: "destructive", 
        title: "Error",
        description: "Failed to start test",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestCompleted = (submissionId: string) => {
    setSelectedSubmissionId(submissionId)
    setCurrentView('results')
  }

  const handleViewResults = (submissionId: string) => {
    setSelectedSubmissionId(submissionId)
    setCurrentView('results')
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatBandScore = (bandScore: number) => {
    return `Band ${bandScore.toFixed(1)}`
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return <Badge variant="secondary">Beginner</Badge>
      case 'intermediate':
        return <Badge variant="default">Intermediate</Badge>
      case 'advanced':
        return <Badge variant="destructive">Advanced</Badge>
      default:
        return <Badge variant="outline">{level}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>
      case 'abandoned':
        return <Badge variant="destructive">Abandoned</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRecentStats = () => {
    const completedTests = history.filter(h => h.status === 'completed')
    const totalAttempts = history.length
    const averageScore = completedTests.length > 0 
      ? completedTests.reduce((sum, h) => sum + (h.overallPercentage || 0), 0) / completedTests.length
      : 0
    const bestScore = completedTests.length > 0
      ? Math.max(...completedTests.map(h => h.overallPercentage || 0))
      : 0
    const passedTests = completedTests.filter(h => h.isPassed).length

    return {
      totalAttempts,
      completedTests: completedTests.length,
      averageScore,
      bestScore,
      passedTests
    }
  }

  // Navigation handling
  if (currentView === 'taking-test' && selectedTest) {
    return (
      <IELTSTestTaking
        token={token}
        test={selectedTest}
        submissionId={selectedSubmissionId}
        onBack={() => setCurrentView('tests')}
        onTestCompleted={handleTestCompleted}
      />
    )
  }

  if (currentView === 'results' && selectedSubmissionId) {
    return (
      <IELTSTestResults
        token={token}
        submissionId={selectedSubmissionId}
        onBack={() => setCurrentView('history')}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">IELTS Practice Tests</h2>
        <div className="flex gap-2">
          <Button 
            variant={currentView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant={currentView === 'tests' ? 'default' : 'outline'}
            onClick={() => setCurrentView('tests')}
          >
            Available Tests
          </Button>
          <Button 
            variant={currentView === 'history' ? 'default' : 'outline'}
            onClick={() => setCurrentView('history')}
          >
            Test History
          </Button>
        </div>
      </div>

      {/* Dashboard View */}
      {currentView === 'dashboard' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getRecentStats().totalAttempts}</div>
                <p className="text-xs text-muted-foreground">
                  {getRecentStats().completedTests} completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getRecentStats().averageScore.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Based on completed tests
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Score</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getRecentStats().bestScore.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Personal best
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tests Passed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getRecentStats().passedTests}</div>
                <p className="text-xs text-muted-foreground">
                  Out of {getRecentStats().completedTests} completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ready to Practice?</CardTitle>
                <CardDescription>Start a new IELTS practice test</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setCurrentView('tests')} className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Browse Available Tests
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Track Your Progress</CardTitle>
                <CardDescription>View your test history and results</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => setCurrentView('history')} className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Test History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Test History */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Tests</CardTitle>
                <CardDescription>Your latest test attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {history.slice(0, 5).map((submission) => (
                    <div key={submission._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{submission.test?.title || 'Unknown Test'}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(submission.endTime || submission.startTime).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {submission.status === 'completed' && (
                          <>
                            <div className="text-right">
                              <div className="font-medium">
                                {submission.overallBandScore ? formatBandScore(submission.overallBandScore) : 'N/A'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {submission.overallPercentage?.toFixed(1)}%
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResults(submission._id!)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {submission.status !== 'completed' && getStatusBadge(submission.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tests View */}
      {currentView === 'tests' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-test">Full Test</SelectItem>
                <SelectItem value="listening-only">Listening</SelectItem>
                <SelectItem value="reading-only">Reading</SelectItem>
                <SelectItem value="writing-only">Writing</SelectItem>
                <SelectItem value="speaking-only">Speaking</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tests Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <Card key={test._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{test.title}</CardTitle>
                        <CardDescription className="mt-2">{test.description}</CardDescription>
                      </div>
                      {getLevelBadge(test.level)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDuration(test.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span>{test.sections?.reduce((sum, section) => sum + (section.questions?.length || 0), 0) || 0} questions</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Sections:</div>
                      <div className="flex flex-wrap gap-1">
                        {test.sections && test.sections.length > 0 ? (
                          test.sections.map((section, index) => (
                            <Badge key={index} variant="outline" className="text-xs capitalize">
                              {section.sectionType}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No sections</span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <strong>Type:</strong> {test.testType.replace('-', ' ')}
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleStartTest(test)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Test
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {testsPagination && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {tests.length} of {testsPagination.totalItems} tests
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentTestsPage === 1}
                  onClick={() => setCurrentTestsPage(currentTestsPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentTestsPage} of {testsPagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentTestsPage === testsPagination.totalPages}
                  onClick={() => setCurrentTestsPage(currentTestsPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History View */}
      {currentView === 'history' && (
        <div className="space-y-6">
          <Card>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No test history found</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setCurrentView('tests')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Take Your First Test
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Band Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attempt</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((submission) => (
                      <TableRow key={submission._id}>
                        <TableCell className="font-medium">
                          {submission.test?.title || 'Unknown Test'}
                        </TableCell>
                        <TableCell>
                          {new Date(submission.endTime || submission.startTime).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {submission.overallPercentage !== undefined 
                            ? `${submission.overallPercentage.toFixed(1)}%`
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          {submission.overallBandScore !== undefined 
                            ? formatBandScore(submission.overallBandScore)
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>{submission.attemptNumber}</TableCell>
                        <TableCell>
                          {submission.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewResults(submission._id!)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {historyPagination && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {history.length} of {historyPagination.totalItems} submissions
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentHistoryPage === 1}
                  onClick={() => setCurrentHistoryPage(currentHistoryPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentHistoryPage} of {historyPagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentHistoryPage === historyPagination.totalPages}
                  onClick={() => setCurrentHistoryPage(currentHistoryPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
