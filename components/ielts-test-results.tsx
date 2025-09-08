"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Award, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Loader2,
  Download,
  Share2
} from "lucide-react"
import { 
  ieltsAPI, 
  IELTSTestSubmission 
} from "@/lib/api"

interface IELTSTestResultsProps {
  token: string
  submissionId: string
  onBack: () => void
}

export function IELTSTestResults({ token, submissionId, onBack }: IELTSTestResultsProps) {
  const { toast } = useToast()
  const [submission, setSubmission] = useState<IELTSTestSubmission | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isPassed, setIsPassed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [submissionId])

  const loadResults = async () => {
    setIsLoading(true)
    try {
      const result = await ieltsAPI.getSubmissionResults(token, submissionId)
      if (result.success && result.data) {
        setSubmission(result.data.submission)
        setAnalysis(result.data.analysis)
        setIsPassed(result.data.isPassed)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load test results",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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

  const getBandScoreColor = (bandScore: number) => {
    if (bandScore >= 8.5) return "text-green-600"
    if (bandScore >= 7.0) return "text-blue-600"
    if (bandScore >= 6.0) return "text-yellow-600"
    if (bandScore >= 5.0) return "text-orange-600"
    return "text-red-600"
  }

  const getBandScoreBadge = (bandScore: number) => {
    if (bandScore >= 8.5) return "Expert User"
    if (bandScore >= 7.0) return "Good User"
    if (bandScore >= 6.0) return "Competent User"
    if (bandScore >= 5.0) return "Modest User"
    if (bandScore >= 4.0) return "Limited User"
    return "Extremely Limited User"
  }

  const handleShareResults = () => {
    if (navigator.share && submission) {
      navigator.share({
        title: 'My IELTS Test Results',
        text: `I scored ${submission.overallBandScore?.toFixed(1)} band score (${submission.overallPercentage?.toFixed(1)}%) on ${submission.test?.title}!`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      if (submission) {
        const text = `I scored ${submission.overallBandScore?.toFixed(1)} band score (${submission.overallPercentage?.toFixed(1)}%) on ${submission.test?.title}!`
        navigator.clipboard.writeText(text)
        toast({
          title: "Copied to clipboard",
          description: "Results summary copied to clipboard",
        })
      }
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading your results...</span>
        </div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Results not found</p>
            <Button className="mt-4" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tests
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShareResults}>
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </Button>
        </div>
      </div>

      {/* Overall Results */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isPassed ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {isPassed ? 'Congratulations!' : 'Keep Practicing!'}
          </CardTitle>
          <CardDescription>
            {isPassed 
              ? 'You have successfully passed the IELTS test!' 
              : 'You can retake the test to improve your score.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className={`text-3xl font-bold ${getBandScoreColor(submission.overallBandScore || 0)}`}>
                {formatBandScore(submission.overallBandScore || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Overall Band Score</div>
              <Badge variant="outline" className="mt-2">
                {getBandScoreBadge(submission.overallBandScore || 0)}
              </Badge>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {submission.overallPercentage?.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
              <div className="mt-2">
                <Progress value={submission.overallPercentage || 0} className="h-2" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {submission.overallScore}/{submission.maxOverallScore}
              </div>
              <div className="text-sm text-muted-foreground">Points Scored</div>
              <div className="text-xs text-muted-foreground mt-2">
                Passing: {submission.test?.passingScore || 0}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {formatDuration(submission.totalTimeSpent || 0)}
              </div>
              <div className="text-sm text-muted-foreground">Time Taken</div>
              <div className="text-xs text-muted-foreground mt-2">
                Attempt #{submission.attemptNumber}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Results */}
      <Card>
        <CardHeader>
          <CardTitle>Section Performance</CardTitle>
          <CardDescription>Detailed breakdown by section</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {submission.sectionResults?.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold capitalize">{result.sectionType}</h3>
                    <p className="text-sm text-muted-foreground">
                      {result.correctAnswers} out of {result.totalQuestions} correct
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getBandScoreColor(result.bandScore)}`}>
                      {formatBandScore(result.bandScore)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress value={result.percentage} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{result.score}/{result.maxScore} points</span>
                  <span>{result.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis and Recommendations */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          {analysis.strengths && analysis.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Areas for Improvement */}
          {analysis.weaknesses && analysis.weaknesses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-orange-600" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recommendations */}
      {analysis && analysis.recommendations && analysis.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Recommendations
            </CardTitle>
            <CardDescription>Suggested next steps to improve your IELTS score</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.recommendations.map((recommendation: string, index: number) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Test Information */}
      <Card>
        <CardHeader>
          <CardTitle>Test Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Test:</strong> {submission.test?.title}
            </div>
            <div>
              <strong>Level:</strong> 
              <Badge variant="outline" className="ml-2 capitalize">
                {submission.test?.level}
              </Badge>
            </div>
            <div>
              <strong>Completed:</strong> {new Date(submission.endTime || submission.startTime).toLocaleString()}
            </div>
            <div>
              <strong>Status:</strong> 
              <Badge className="ml-2" variant={isPassed ? "default" : "destructive"}>
                {isPassed ? "Passed" : "Failed"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={onBack}>
          Take Another Test
        </Button>
        {!isPassed && (
          <Button>
            Retake This Test
          </Button>
        )}
      </div>
    </div>
  )
}
