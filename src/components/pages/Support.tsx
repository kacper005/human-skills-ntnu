import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Link,
} from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import SchoolIcon from "@mui/icons-material/School";
import QuizIcon from "@mui/icons-material/Quiz";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import PeopleIcon from "@mui/icons-material/People";

const FAQ_ITEMS = [
  {
    question: "How do I create a new study program?",
    answer:
      "Navigate to the Study Programs section from the Admin page. Click 'Add New Program' and fill in the program name, campus, and level. Once created, you can assign students and teachers to the program.",
    icon: <SchoolIcon sx={{ color: "#7c3aed" }} />,
  },
  {
    question: "How do I assign roles to users?",
    answer:
      "Go to the Users section and find the user you want to modify. Click the role icon (shield) next to their name to change their role between Student, Teacher, and Administrator.",
    icon: <PeopleIcon sx={{ color: "#f97316" }} />,
  },
  {
    question: "How are test results evaluated?",
    answer:
      "Test results are automatically evaluated based on the test template configuration. You can view detailed results in the Test Sessions section. Results can be exported as JSON for further analysis.",
    icon: <QuizIcon sx={{ color: "#3b82f6" }} />,
  },
  {
    question: "How do cognitive games track progress?",
    answer:
      "Cognitive games record session data including scores, reaction times, and accuracy. Game sessions are linked to user accounts and can be reviewed in the Game Templates section.",
    icon: <SportsEsportsIcon sx={{ color: "#22c55e" }} />,
  },
  {
    question: "Can I share test sessions with other teachers?",
    answer:
      "Yes, test sessions can be shared with teachers through the Student-Teacher Relation system. Use the Share button in the Test Sessions view to grant access to specific teachers.",
    icon: <QuizIcon sx={{ color: "#64748b" }} />,
  },
];

const QUICK_LINKS = [
  {
    title: "Documentation",
    description: "Read the full platform documentation",
    icon: <SchoolIcon />,
    color: "#7c3aed",
    bgColor: "#ede9fe",
  },
  {
    title: "Report a Bug",
    description: "Found an issue? Let us know",
    icon: <SupportAgentIcon />,
    color: "#ef4444",
    bgColor: "#fee2e2",
  },
  {
    title: "Feature Request",
    description: "Suggest new features or improvements",
    icon: <SportsEsportsIcon />,
    color: "#f97316",
    bgColor: "#fff7ed",
  },
];

export const Support: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSubject("");
      setMessage("");
      alert("Your message has been sent! We will get back to you shortly.");
    } catch (error) {
      console.error("Error sending support message: ", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "#fef3c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#d97706",
            }}
          >
            <SupportAgentIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Support
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Get help, browse FAQs, or contact the support team
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}
          >
            Quick Links
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {QUICK_LINKS.map((link, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card
                  sx={{
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 16px -4px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: link.bgColor,
                        color: link.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      {link.icon}
                    </Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}
                    >
                      {link.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      {link.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}
          >
            Frequently Asked Questions
          </Typography>
          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            {FAQ_ITEMS.map((item, index) => (
              <Accordion
                key={index}
                disableGutters
                elevation={0}
                sx={{
                  "&:before": { display: "none" },
                  borderBottom:
                    index < FAQ_ITEMS.length - 1 ? "1px solid #e2e8f0" : "none",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#64748b" }} />}
                  sx={{
                    px: 3,
                    py: 1,
                    "&:hover": { bgcolor: "#f8fafc" },
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                      gap: 2,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1.5,
                      bgcolor: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#1e293b" }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0, ml: 7 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#64748b", lineHeight: 1.7 }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}
          >
            Contact Support
          </Typography>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: "#ede9fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7c3aed",
                  }}
                >
                  <EmailIcon />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, color: "#1e293b" }}
                  >
                    Send us a message
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    {"We'll respond within 24 hours"}
                  </Typography>
                </Box>
              </Box>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Subject"
                  placeholder="What can we help you with?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  size="small"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />
                <TextField
                  fullWidth
                  label="Message"
                  placeholder="Describe your issue or question in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  multiline
                  rows={5}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!subject.trim() || !message.trim() || sending}
                  startIcon={<SendIcon />}
                  sx={{
                    bgcolor: "#7c3aed",
                    "&:hover": { bgcolor: "#6d28d9" },
                    "&:disabled": { bgcolor: "#e2e8f0" },
                    borderRadius: 2,
                    py: 1.25,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", display: "block", mb: 1 }}
                >
                  Or reach us directly at
                </Typography>
                <Link
                  href="mailto:support@humanskills.com"
                  sx={{
                    color: "#7c3aed",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  support@humanskills.com
                </Link>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}
              >
                System Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Version
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#1e293b", fontWeight: 600 }}
                  >
                    1.0.0
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Platform
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#1e293b", fontWeight: 600 }}
                  >
                    Human Skills
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Environment
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#22c55e", fontWeight: 600 }}
                  >
                    Production
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};