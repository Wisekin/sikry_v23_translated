"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Download, Upload, Building2, Globe, MapPin, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslation } from 'react-i18next';
import { getCompanies } from "@/actions/companies"
import type { DiscoveredCompany } from "@/types/database"

export default function CompaniesPage() {
  const router = useRouter()
  const { t } = useTranslation('companiesPage');
  const [companies, setCompanies] = useState<DiscoveredCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const data = await getCompanies()
      setCompanies(data)
    } catch (error) {
      console.error("Error loading companies:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.domain?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter
    return matchesSearch && matchesIndustry
  })

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return <Badge className="bg-green-100 text-green-800">{confidence}%</Badge>
    if (confidence >= 60) return <Badge className="bg-yellow-100 text-yellow-800">{confidence}%</Badge>
    return <Badge className="bg-red-100 text-red-800">{confidence}%</Badge>
  }

  const renderStatusBadge = (verified: boolean) => {
    if (verified) {
      return <Badge className="bg-green-100 text-green-800">{t("verified")}</Badge>
    }
    return <Badge variant="outline">{t("status.pending", { ns: 'common' })}</Badge>
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Building2 className="h-12 w-12 text-gray-400 mb-4 animate-pulse" />
        <p className="mt-2 text-sm text-muted-foreground">{t("loading", { ns: 'common' })}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("pagination.showingResults", { ns: 'common', count: filteredCompanies.length })}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            {t("import")}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("export")}
          </Button>
          <Button onClick={() => router.push("/companies/new")}>
            <Plus className="mr-2 h-4 w-4" />
            {t("addNew")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{t("filters.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                type="search"
                placeholder={t("filters.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filters.selectIndustryPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allIndustries")}</SelectItem>
                  <SelectItem value="Technology">{t("filters.industrySoftwareDev")}</SelectItem>
                  <SelectItem value="Marketing">{t("filters.industryMarketing")}</SelectItem>
                  <SelectItem value="Finance">{t("filters.industryFintech")}</SelectItem>
                  {/* Add more industries as needed */}
                </SelectContent>
              </Select>
            </div>
            {/* Add more filters here, e.g., location, company size */}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>{t("listTitle")}</CardTitle>
            <CardDescription>
              {t("pagination.showingCount", { ns: 'common', count: filteredCompanies.length, total: companies.length })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCompanies.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("tableHeaders.name")}</TableHead>
                    <TableHead>{t("tableHeaders.domain")}</TableHead>
                    <TableHead>{t("tableHeaders.industry")}</TableHead>
                    <TableHead>{t("tableHeaders.location")}</TableHead>
                    <TableHead>{t("tableHeaders.size")}</TableHead>
                    <TableHead>{t("tableHeaders.confidence")}</TableHead>
                    <TableHead>{t("tableHeaders.status")}</TableHead>
                    <TableHead>{t("actions", { ns: 'common' })}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium flex items-center">
                        {company.logo_url ? (
                          <img src={company.logo_url} alt={`${company.name} logo`} className="h-6 w-6 mr-2 rounded-sm object-contain" />
                        ) : (
                          <Building2 className="h-5 w-5 mr-2 text-gray-400" />
                        )}
                        {company.name}
                      </TableCell>
                      <TableCell>
                        <a href={`http://${company.domain}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {company.domain}
                        </a>
                      </TableCell>
                      <TableCell>{company.industry}</TableCell>
                      <TableCell>{company.location_text || "N/A"}</TableCell>
                      <TableCell>{company.company_size ? `${company.company_size} ${t("filters.employeesSuffix")}` : "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={(company.confidence_score || 0) > 70 ? "default" : "secondary"} className={(company.confidence_score || 0) > 70 ? "bg-sky-100 text-sky-700" : ""}>
                          {company.confidence_score || 0}%
                        </Badge>
                      </TableCell>
                      <TableCell>{renderStatusBadge(company.is_verified || false)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/companies/${company.id}`)}>
                          {t("viewDetails", { ns: 'common' })}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium">{t("noResults.title")}</h3>
                <p className="text-muted-foreground">{t("noResults.description")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
