"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Loader2, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Users, 
  Clock, 
  BookOpen,
  TrendingUp,
  Filter
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  IELTSStatistics, 
  IELTSTestsResponse, 
  IELTSSubmissionsResponse 
} from "@/lib/api"
import { IELTSTestForm } from "./ielts-test-form"

interface IELTSAdminProps {
  token: string
}

export function IELTSAdmin({ token }: IELTSAdminProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentView, setCurrentView] = useState<'dashboard' | 'tests' | 'submissions' | 'create-test' | 'edit-test'>('dashboard')
  const [tests, setTests] = useState<IELTSTest[]>([])
  const [submissions, setSubmissions] = useState<IELTSTestSubmission[]>([])
  const [statistics, setStatistics] = useState<IELTSStatistics | null>(null)
  const [selectedTest, setSelectedTest] = useState<IELTSTest | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<IELTSTestSubmission | null>(null)
  const [editingTest, setEditingTest] = useState<IELTSTest | null>(null)
  const [showQuestionDetails, setShowQuestionDetails] = useState<{[key: string]: boolean}>({})
  const [loadingTestId, setLoadingTestId] = useState<string | null>(null)
  
  // Pagination and filters
  const [testsPagination, setTestsPagination] = useState<any>(null)
  const [submissionsPagination, setSubmissionsPagination] = useState<any>(null)
  const [currentTestsPage, setCurrentTestsPage] = useState(1)
  const [currentSubmissionsPage, setCurrentSubmissionsPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [testTypeFilter, setTestTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Load initial data
  useEffect(() => {
    if (currentView === 'dashboard') {
      loadStatistics()
    } else if (currentView === 'tests') {
      loadTests()
    } else if (currentView === 'submissions') {
      loadSubmissions()
    }
  }, [currentView, currentTestsPage, currentSubmissionsPage, levelFilter, testTypeFilter, statusFilter])

  const loadStatistics = async () => {
    setIsLoading(true)
    try {
      const result = await ieltsAPI.admin.getStatistics(token)
      if (result.success && result.data) {
        setStatistics(result.data)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load statistics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadTests = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page: currentTestsPage,
        limit: 10
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

  const loadSubmissions = async () => {
    setIsLoading(true)
    try {
      const params: any = {
        page: currentSubmissionsPage,
        limit: 10
      }
      if (statusFilter !== 'all') params.status = statusFilter

      const result = await ieltsAPI.admin.getAllSubmissions(token, params)
      if (result.success && result.data) {
        // Debug log to see submission structure
        console.log("Submissions data:", result.data.submissions)
        if (result.data.submissions?.length > 0) {
          console.log("First submission:", result.data.submissions[0])
          console.log("testId type:", typeof result.data.submissions[0].testId)
          console.log("testId value:", result.data.submissions[0].testId)
          console.log("userId type:", typeof result.data.submissions[0].userId)
          console.log("userId value:", result.data.submissions[0].userId)
        }
        
        setSubmissions(result.data.submissions)
        setSubmissionsPagination(result.data.pagination)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return

    try {
      await ieltsAPI.admin.deleteTest(token, testId)
      toast({
        title: "Success",
        description: "Test deleted successfully",
      })
      loadTests()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete test",
        variant: "destructive",
      })
    }
  }

  const handleEditTest = async (test: IELTSTest) => {
    const token = localStorage.getItem("token")
    if (!token || !test._id) return

    try {
      setLoadingTestId(test._id)
      
      // Show loading toast
      toast({
        title: "Loading test details...",
        description: "Fetching complete test data for editing",
      })
      
      // Fetch full test details with all questions
      const result = await ieltsAPI.admin.getTestDetails(token, test._id)
      
      if (result.success && result.data?.test) {
        setEditingTest(result.data.test)
        setCurrentView('edit-test')
        toast({
          title: "Test loaded successfully",
          description: "You can now edit all sections and questions",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load test details for editing",
        })
      }
    } catch (error) {
      console.error("Error fetching test details:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load test details for editing",
      })
    } finally {
      setLoadingTestId(null)
    }
  }

  const handleTestCreated = () => {
    setCurrentView('tests')
    setEditingTest(null)
    loadTests()
  }

  const handleViewTests = () => {
    setCurrentView('tests')
    // Reset to first page and reload tests when switching to Tests tab
    setCurrentTestsPage(1)
    
    toast({
      title: "Refreshing tests...",
      description: "Loading latest test data",
    })
    
    loadTests()
  }

  const handleViewSubmissions = () => {
    setCurrentView('submissions')
    // Reset to first page and reload submissions when switching to Submissions tab
    setCurrentSubmissionsPage(1)
    
    toast({
      title: "Refreshing submissions...", 
      description: "Loading latest submission data",
    })
    
    loadSubmissions()
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

  const formatBandScore = (bandScore: number) => {
    return `Band ${bandScore.toFixed(1)}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  // Navigation views
  if (currentView === 'create-test') {
    return (
      <IELTSTestForm 
        token={token}
        onBack={() => setCurrentView('tests')}
        onTestCreated={handleTestCreated}
      />
    )
  }

  if (currentView === 'edit-test' && editingTest) {
    return (
      <IELTSTestForm 
        token={token}
        onBack={() => setCurrentView('tests')}
        onTestCreated={handleTestCreated}
        editTest={editingTest}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">IELTS Test Management</h2>
        <div className="flex gap-2">
          <Button 
            variant={currentView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant={currentView === 'tests' ? 'default' : 'outline'}
            onClick={handleViewTests}
          >
            Tests
          </Button>
          <Button 
            variant={currentView === 'submissions' ? 'default' : 'outline'}
            onClick={handleViewSubmissions}
          >
            Submissions
          </Button>
        </div>
      </div>

      {/* Dashboard View */}
      {currentView === 'dashboard' && (
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : statistics ? (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.overview.totalTests}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.overview.totalSubmissions}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.overview.completedSubmissions}</div>
                    <p className="text-xs text-muted-foreground">
                      {statistics.overview.totalSubmissions > 0 
                        ? ((statistics.overview.completedSubmissions / statistics.overview.totalSubmissions) * 100).toFixed(1)
                        : '0'
                      }% completion rate
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statistics.overview.inProgressSubmissions}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Average Scores by Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statistics.avgScoresByLevel && statistics.avgScoresByLevel.length > 0 ? (
                        statistics.avgScoresByLevel.map((level) => (
                          <div key={level._id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getLevelBadge(level._id)}
                              <span className="text-sm">({level.count} submissions)</span>
                            </div>
                            <span className="font-medium">{level.averageScore.toFixed(1)}%</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No level data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {statistics.popularTests && statistics.popularTests.length > 0 ? (
                        statistics.popularTests.map((test) => (
                          <div key={test.testId} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{test.title}</span>
                              <span className="text-xs text-muted-foreground">{test.submissionCount} attempts</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(test.averageScore / 100) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs ml-2">{test.averageScore.toFixed(1)}%</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No test data available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No statistics available</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tests View */}
      {currentView === 'tests' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center justify-between">
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
            <Button onClick={() => setCurrentView('create-test')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Test
            </Button>
          </div>

          {/* Tests Table */}
          <Card>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tests.map((test) => (
                      <TableRow key={test._id}>
                        <TableCell className="font-medium">{test.title}</TableCell>
                        <TableCell>{getLevelBadge(test.level)}</TableCell>
                        <TableCell className="capitalize">{test.testType.replace('-', ' ')}</TableCell>
                        <TableCell>{formatDuration(test.duration)}</TableCell>
                        <TableCell>{test.questionCount || 0}</TableCell>
                        <TableCell>
                          <Badge variant={test.isActive ? "default" : "secondary"}>
                            {test.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTest(test)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTest(test)}
                              disabled={loadingTestId === test._id}
                            >
                              {loadingTestId === test._id ? (
                                <div className="w-4 h-4 animate-spin border-2 border-gray-300 border-t-gray-600 rounded-full" />
                              ) : (
                                <Edit className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTest(test._id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

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

      {/* Submissions View */}
      {currentView === 'submissions' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submissions Table */}
          <Card>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Band Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Attempt</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission._id}>
                        <TableCell className="font-medium">
                          {(() => {
                            if (typeof submission.testId === 'object' && submission.testId) {
                              return submission.testId.title || submission.testId._id
                            }
                            return submission.test?.title || submission.testId || 'Unknown Test'
                          })()}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            if (typeof submission.userId === 'object' && submission.userId) {
                              return submission.userId.email || submission.userId._id
                            }
                            return submission.userId || 'Unknown User'
                          })()}
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
                          {submission.endTime 
                            ? new Date(submission.endTime).toLocaleDateString()
                            : new Date(submission.startTime).toLocaleDateString()
                          }
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {submissionsPagination && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {submissions.length} of {submissionsPagination.totalItems} submissions
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentSubmissionsPage === 1}
                  onClick={() => setCurrentSubmissionsPage(currentSubmissionsPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentSubmissionsPage} of {submissionsPagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentSubmissionsPage === submissionsPagination.totalPages}
                  onClick={() => setCurrentSubmissionsPage(currentSubmissionsPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Details Dialog */}
      {selectedTest && (
        <Dialog open={!!selectedTest} onOpenChange={() => {
          setSelectedTest(null)
          setShowQuestionDetails({})
        }}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedTest.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Level:</strong> {selectedTest.level}
                </div>
                <div>
                  <strong>Type:</strong> {selectedTest.testType}
                </div>
                <div>
                  <strong>Duration:</strong> {formatDuration(selectedTest.duration)}
                </div>
                <div>
                  <strong>Passing Score:</strong> {selectedTest.passingScore}
                </div>
              </div>
              <div>
                <strong>Description:</strong>
                <p className="mt-1">{selectedTest.description}</p>
              </div>
              <div>
                <strong>Sections:</strong>
                <div className="mt-2 space-y-4">
                  {selectedTest.sections && selectedTest.sections.length > 0 ? (
                    selectedTest.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border rounded p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-lg">{section.title}</div>
                          {section.questions && section.questions.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowQuestionDetails(prev => ({
                                ...prev,
                                [`${sectionIndex}`]: !prev[`${sectionIndex}`]
                              }))}
                            >
                              {showQuestionDetails[`${sectionIndex}`] ? 'Hide' : 'Show'} Questions
                            </Button>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          {section.sectionType} • {section.questions?.length || 0} questions • {formatDuration(section.timeLimit)}
                        </div>
                        
                        {/* Questions List */}
                        {section.questions && section.questions.length > 0 && showQuestionDetails[`${sectionIndex}`] && (
                          <div className="mt-3">
                            <div className="font-medium text-sm mb-2">Questions:</div>
                            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2 bg-gray-50">
                              {section.questions.map((question, questionIndex) => (
                                <div key={questionIndex} className="bg-white rounded p-3 text-sm shadow-sm">
                                  <div className="flex items-start justify-between mb-2">
                                    <span className="font-medium">Q{question.questionNumber}. {question.questionType}</span>
                                    <span className="text-xs text-muted-foreground">{question.points} pts</span>
                                  </div>
                                  
                                  <div className="mb-2">
                                    <div className="font-medium">Question:</div>
                                    <div className="text-gray-700">{question.questionText}</div>
                                  </div>
                                  
                                  {/* Show options for multiple choice */}
                                  {question.questionType === 'multiple-choice' && question.options && (
                                    <div className="mb-2">
                                      <div className="font-medium">Options:</div>
                                      <div className="ml-2">
                                        {question.options.map((option, optionIndex) => (
                                          <div key={option.optionId} className="text-gray-600">
                                            {String.fromCharCode(65 + optionIndex)}. {option.text}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Show correct answer */}
                                  {question.correctAnswer && (
                                    <div className="text-green-600 font-medium">
                                      Correct Answer: {question.correctAnswer}
                                    </div>
                                  )}
                                  
                                  {/* Show audio file if available */}
                                  {question.audioUrl && (
                                    <div className="text-blue-600 text-xs">
                                      Audio: {question.audioUrl}
                                    </div>
                                  )}
                                  
                                  {/* Show image if available */}
                                  {question.imageUrl && (
                                    <div className="text-blue-600 text-xs">
                                      Image: {question.imageUrl}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No sections available</p>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Submission Details Dialog */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submission Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Status:</strong> {getStatusBadge(selectedSubmission.status)}
                </div>
                <div>
                  <strong>Attempt:</strong> {selectedSubmission.attemptNumber}
                </div>
                <div>
                  <strong>Overall Score:</strong> {selectedSubmission.overallPercentage?.toFixed(1)}%
                </div>
                <div>
                  <strong>Band Score:</strong> {selectedSubmission.overallBandScore ? formatBandScore(selectedSubmission.overallBandScore) : 'N/A'}
                </div>
                <div>
                  <strong>Start Time:</strong> {new Date(selectedSubmission.startTime).toLocaleString()}
                </div>
                <div>
                  <strong>End Time:</strong> {selectedSubmission.endTime ? new Date(selectedSubmission.endTime).toLocaleString() : 'N/A'}
                </div>
              </div>
              {selectedSubmission.sectionResults && (
                <div>
                  <strong>Section Results:</strong>
                  <div className="mt-2 space-y-2">
                    {selectedSubmission.sectionResults.map((result, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{result.sectionType}</span>
                          <span>{result.percentage.toFixed(1)}% • {formatBandScore(result.bandScore)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {result.correctAnswers}/{result.totalQuestions} correct
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
