import React from "react";
import { Box, Typography, Container, Grid, Card, CardContent, Avatar, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { 
  Hospital, Ambulance, ScanLine, Baby, Radiation, HeartPulse, Brain, Bone, Ear
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const teamMembers = [
  { name: "Nikita Patil[PL]", role: "Frontend Developer", description: "Creating a seamless and responsive UI. ✨", imageUrl: "" },
  { name: "Priya Mourya", role: "Full Stack Developer", description: "Bridges frontend and backend for full integration. 🌐", imageUrl: "" },
  { name: "Tejas Patil", role: "Backend Developer", description: "Handles server-side logic and databases. 💾", imageUrl: "" },
  { name: "Puja Shinghare", role: "Backend Developer", description: "Handles server-side logic and databases. 🛠️", imageUrl: "" },
  { name: "Owais Shaikh", role: "Backend Developer", description: "Handles server-side logic and databases. 🔧", imageUrl: "" },
];

const serviceIcons = [
  <Hospital size={32} color="#0288d1" />, 
  <Ambulance size={32} color="#0288d1" />, 
  <ScanLine size={32} color="#0288d1" />, 
  <Radiation size={32} color="#0288d1" />, 
  <Baby size={32} color="#0288d1" />, 
  <HeartPulse size={32} color="#0288d1" />, 
  <Brain size={32} color="#0288d1" />, 
  <Bone size={32} color="#0288d1" />, 
  <Ear size={32} color="#0288d1" />, 
  <Baby size={32} color="#0288d1" />
];

const services = [
  "Primary & Preventive Care 🩺", 
  "Emergency & Critical Services 🚑", 
  "Advanced Diagnostics & Imaging 📷",
  "Cancer Care & Oncology 🎗️", 
  "Maternity & Neonatal Services 👶", 
  "Chronic Disease & Dialysis 💉",
  "Neuro & Spine Treatments 🧠", 
  "Orthopedic Surgery & Rehab 🦴", 
  "ENT & Pulmonary Care 👂", 
  "Pediatrics & Child Surgery 🍼",
];

const features = [
  { icon: <Ambulance size={40} color="#0288d1" />, title: "24/7 Emergency Services 🚨", description: "Round-the-clock emergency care with skilled professionals." },
  { icon: <Hospital size={40} color="#0288d1" />, title: "Specialized Departments 🏥", description: "Cardiology, Neurology, Oncology, and more." },
  { icon: <HeartPulse size={40} color="#0288d1" />, title: "Experienced Doctors 👩‍⚕️", description: "Qualified, compassionate medical professionals." },
];

const AboutUs = () => {
  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", fontFamily: "'Roboto', sans-serif" }}>
      <Navbar />

      {/* Hero Section with Enhanced Glassmorphism */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Box
          sx={{
            minHeight: "100vh",
            background: "linear-gradient(145deg, #0288d1 0%, #4fc3f7 100%)",
            backgroundImage: "url(./assets/images/abouts.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(15px)",
              WebkitBackdropFilter: "blur(15px)",
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 800, 
                color: "#fff", 
                textShadow: "3px 3px 10px rgba(0,0,0,0.6)",
                fontSize: { xs: "2.8rem", md: "4.5rem" },
                mb: 3,
                letterSpacing: "0.5px",
              }}
            >
              MediCare
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: "#e1f5fe", 
                maxWidth: 800, 
                mx: "auto", 
                fontSize: { xs: "1.1rem", md: "1.5rem" },
                lineHeight: 1.7,
                fontWeight: 400,
              }}
            >
              Setting benchmarks in healthcare through empathy and technological advancement 
            </Typography>
          </Container>
        </Box>
      </motion.div>

      {/* Services Section */}
      <Box sx={{ bgcolor: "#e1f5fe", py: 10 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                textAlign: "center", 
                color: "#01579b", 
                mb: 8,
                fontSize: { xs: "2.2rem", md: "3rem" },
              }}
            >
              Our Services 🩺
            </Typography>
          </motion.div>
          <Grid container spacing={3}>
            {services.map((service, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Paper 
                    elevation={8} 
                    sx={{ 
                      p: 4, 
                      borderRadius: 4, 
                      textAlign: "center", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 3,
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(2, 136, 209, 0.2)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    {serviceIcons[idx]}
                    <Typography 
                      variant="subtitle1" 
                      sx={{ fontWeight: 600, color: "#01579b", fontSize: "1.1rem" }}
                    >
                      {service}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ bgcolor: "#fff", py: 10 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                textAlign: "center", 
                color: "#01579b", 
                mb: 8,
                fontSize: { xs: "2.2rem", md: "3rem" },
              }}
            >
              Why Choose Us 🌟
            </Typography>
          </motion.div>
          <Grid container spacing={4}>
            {features.map((feature, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      p: 5, 
                      borderRadius: 4, 
                      textAlign: "center",
                      bgcolor: "#f8fafc",
                      border: "1px solid rgba(2, 136, 209, 0.2)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ fontWeight: 600, color: "#01579b", mb: 2, fontSize: "1.25rem" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#37474f", lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Box sx={{ bgcolor: "#e1f5fe", py: 10 }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                textAlign: "center", 
                color: "#01579b", 
                mb: 8,
                fontSize: { xs: "2.2rem", md: "3rem" },
              }}
            >
              Meet Our Team 👥
            </Typography>
          </motion.div>
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                >
                  <Card 
                    sx={{ 
                      textAlign: "center", 
                      p: 4, 
                      borderRadius: 4,
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(2, 136, 209, 0.2)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <Avatar 
                      src={member.imageUrl} 
                      alt={member.name} 
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mx: "auto", 
                        mb: 3,
                        bgcolor: member.imageUrl ? "transparent" : "#b3e5fc",
                        fontSize: "2.5rem",
                        color: "#01579b",
                        border: "2px solid #0288d1",
                      }}
                    >
                      {!member.imageUrl && member.name[0]}
                    </Avatar>
                    <CardContent>
                      <Typography 
                        variant="h6" 
                        sx={{ fontWeight: 600, color: "#01579b", fontSize: "1.25rem" }}
                      >
                        {member.name}
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ color: "#0288d1", fontWeight: 500, mb: 1 }}
                      >
                        {member.role}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ color: "#37474f", lineHeight: 1.6 }}
                      >
                        {member.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
};

export default AboutUs;