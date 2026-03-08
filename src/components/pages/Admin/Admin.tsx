import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { useNavigate } from "react-router-dom";
import { AdminStudyPrograms } from "./AdminStudyPrograms";
import { AdminUsers } from "./AdminUsers";
import { AdminTestTemplates } from "./AdminTestTemplates";
import { AdminGameTemplates } from "./AdminGameTemplates";

type AdminSubPage =
  | "overview"
  | "study-programs"
  | "users"
  | "test-templates"
  | "game-templates";

interface AdminCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  onManage?: () => void;
}

function AdminCard({
  title,
  description,
  icon,
  color,
  bgGradient,
  onManage,
}: AdminCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
        cursor: "pointer",
        transition: "all 0.3s ease",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 24px -8px ${color}40`,
        },
      }}
      onClick={onManage}
    >
      <Box sx={{ height: 6, backgroundImage: bgGradient }} />
      <CardContent
        sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            backgroundImage: bgGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#64748b", lineHeight: 1.5 }}
          >
            {description}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            onManage?.();
          }}
          sx={{
            mt: "auto",
            borderColor: `${color}40`,
            color: color,
            fontWeight: 600,
            "&:hover": {
              borderColor: color,
              bgcolor: `${color}08`,
            },
          }}
        >
          Manage
        </Button>
      </CardContent>
    </Card>
  );
}

function AdminOverview({
  onNavigate,
}: {
  onNavigate: (page: AdminSubPage) => void;
}) {
  return (
    <>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, color: "#1e293b", mb: 3 }}
      >
        Management
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <AdminCard
            title="Study Programs"
            description="Create and manage study programs, curricula, and learning paths"
            icon={<SchoolIcon sx={{ fontSize: 40 }} />}
            color="#7c3aed"
            bgGradient="linear-gradient(135deg, #7c3aed, #6d28d9)"
            onManage={() => onNavigate("study-programs")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AdminCard
            title="Users"
            description="Manage user accounts, roles, and permissions"
            icon={<PeopleIcon sx={{ fontSize: 40 }} />}
            color="#f97316"
            bgGradient="linear-gradient(135deg, #f97316, #ea580c)"
            onManage={() => onNavigate("users")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AdminCard
            title="Test Templates"
            description="View and manage psychometric test templates"
            icon={<QuizIcon sx={{ fontSize: 40 }} />}
            color="#3b82f6"
            bgGradient="linear-gradient(135deg, #3b82f6, #2563eb)"
            onManage={() => onNavigate("test-templates")}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AdminCard
            title="Game Templates"
            description="View cognitive game sessions and configurations"
            icon={<SportsEsportsIcon sx={{ fontSize: 40 }} />}
            color="#22c55e"
            bgGradient="linear-gradient(135deg, #22c55e, #16a34a)"
            onManage={() => onNavigate("game-templates")}
          />
        </Grid>
      </Grid>
    </>
  );
}

export const Admin: React.FC = () => {
  const [subPage, setSubPage] = useState<AdminSubPage>("overview");
  const navigate = useNavigate();

  const renderSubPageContent = () => {
    switch (subPage) {
      case "study-programs":
        return <AdminStudyPrograms />;
      case "users":
        return <AdminUsers />;
      case "test-templates":
        return <AdminTestTemplates />;
      case "game-templates":
        return <AdminGameTemplates />;
      default:
        return <AdminOverview onNavigate={setSubPage} />;
    }
  };

  const subPageTitle = (() => {
    switch (subPage) {
      case "study-programs":
        return "Study Programs";
      case "users":
        return "Users";
      case "test-templates":
        return "Test Templates";
      case "game-templates":
        return "Game Templates";
      default:
        return "Admin Dashboard";
    }
  })();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f1f5f9" }}>
      {/* Admin Sub-header */}
      <Box
        sx={{
          backgroundImage:
            "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          py: 3,
          px: 3,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <AdminPanelSettingsIcon
                sx={{ color: "#f97316", fontSize: 28 }}
              />
              {subPage !== "overview" && (
                <Typography
                  variant="body1"
                  onClick={() => setSubPage("overview")}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    "&:hover": { color: "white" },
                    transition: "color 0.2s",
                  }}
                >
                  Admin Dashboard
                </Typography>
              )}
              {subPage !== "overview" && (
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255,255,255,0.4)" }}
                >
                  /
                </Typography>
              )}
              <Typography
                variant="h5"
                sx={{ color: "white", fontWeight: 700 }}
              >
                {subPageTitle}
              </Typography>
            </Box>
            <Button
              color="inherit"
              startIcon={<ArrowBackIcon />}
              onClick={
                subPage === "overview"
                  ? () => navigate("/home")
                  : () => setSubPage("overview")
              }
              sx={{
                color: "white",
                "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
              }}
            >
              {subPage === "overview" ? "Back to Home" : "Back to Dashboard"}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {renderSubPageContent()}
      </Container>
    </Box>
  );
};