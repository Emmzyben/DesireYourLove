<?php
session_start();

// Redirect to dashboard if already logged in
if (isset($_SESSION['user_id'])) {
    header('Location: dashboard.php');
    exit();
}

$page_title = 'Find Your Perfect Match';
include 'includes/header.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DesireYourLove - Find Your Perfect Match</title>
   <link rel="stylesheet" href="style.css">
   <meta name="description" content="DesireYourLove is a dating platform where genuine connections bloom into lasting love stories. Join thousands who've discovered their soulmate through meaningful conversations and authentic relationships built on trust.">
   <meta name="keywords" content="dating, love, relationships, matchmaking, online dating, find love, meaningful connections, dating website, singles, couples, romance">
   <meta name="author" content="zippy-tech">
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="container">
            <div class="nav-container">
                <div class="logo">DesireYourLove</div>
                
                <div class="mobile-menu-toggle" onclick="toggleMobileMenu()">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                
                <ul class="nav-links" id="navLinks">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#faq">FAQ</a></li>
                    <div class="auth-buttons">
                        <a href="login.php" class="btn btn-outline" >Sign In</a>
                        <a href="register.php" class="btn btn-primary" >Sign Up</a>
                    </div>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Landing Page -->
    <div id="landing" class="screen active">
        <!-- Home Section -->
        <section id="home">
            <div class="container">
                <div class="hero-content">
                    <h1>Find Your <span class="highlight">Perfect Match</span></h1>
                    <p>Where genuine connections bloom into lasting love stories. Join thousands who've discovered their soulmate through meaningful conversations and authentic relationships built on trust.</p>
                    
                    <div class="hero-cta">
                        <a href="register.php" class="btn btn-primary" style="font-size: 1.3rem; padding: 1.2rem 3.5rem;">Start Your Love Story</a>
                    </div>
                    
                    <div class="hero-image-placeholder">
                       <img src="images/trendy-curly-man-joyful-young-600nw-2207145831.webp" alt="">
                    </div>
                    
                    <div class="hero-stats">
                        <div class="stat-item fade-in">
                            <span class="stat-number">50K+</span>
                            <span class="stat-label">Happy Couples</span>
                        </div>
                        <div class="stat-item fade-in">
                            <span class="stat-number">89%</span>
                            <span class="stat-label">Success Rate</span>
                        </div>
                        <div class="stat-item fade-in">
                            <span class="stat-number">200K+</span>
                            <span class="stat-label">Active Members</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features">
            <div class="container">
                <h2 class="section-title">Why Choose DesireYourLove?</h2>
                <p class="section-subtitle">We believe love shouldn't be rushed. That's why we focus on quality connections that last a lifetime, not just tonight.</p>
                
                <div class="features-grid">
                    <div class="feature fade-in">
                        <div class="feature-image-placeholder">
                          <img src="images/img1.avif" alt="Feature Image: Two people having deep conversation over coffee, engaged and smiling">  
                        </div>
                        <h3>Meaningful Connections</h3>
                        <p>Our thoughtful matching system goes beyond surface level. We connect hearts and minds, not just profiles and photos. Every match is carefully curated based on compatibility, values, and life goals.</p>
                    </div>
                    
                    <div class="feature fade-in">
                        <div class="feature-image-placeholder">
                         <img src="images/img2.avif" alt="Feature Image: Shield with checkmark, security icons, verified profile badges">   
                        </div>
                        <h3>Safe & Secure</h3>
                        <p>Your privacy matters to us. With verified profiles, secure messaging, and 24/7 moderation, you can focus on what's important - finding love without worrying about safety.</p>
                    </div>
                    
                    <div class="feature fade-in">
                        <div class="feature-image-placeholder">
                            <img src="images/img3.png" alt=" Feature Image: Wedding photos, happy couples at different life stages, success stories">
                           
                        </div>
                        <h3>Proven Success</h3>
                        <p>Over 50,000 couples have found lasting love through our platform. Real people, real relationships, real happiness. Join our community of success stories.</p>
                    </div>
                    
                    <div class="feature fade-in">
                        <div class="feature-image-placeholder">
                          <img src="images/img4.png" alt="Feature Image: AI-powered matching interface, compatibility charts, personalized suggestions">  
                        </div>
                        <h3>Smart Matching</h3>
                        <p>Our advanced algorithm learns from your preferences and interactions to suggest increasingly compatible matches. The more you use the app, the better your matches become.</p>
                    </div>
                    
               
                 
                </div>
            </div>
        </section>

        <!-- Success Stories Section -->
        <section class="success-stories">
            <div class="container">
                <h2 class="section-title">Real Love Stories</h2>
                <p class="section-subtitle">Don't just take our word for it. Here are some beautiful stories from couples who found their forever person through DesireYourLove.</p>
                
                <div class="stories-grid">
                    <div class="story-card fade-in">
                        <div class="story-image-placeholder">
                           <img src="images/pic1.avif" alt="Couple Photo: Sarah & James"> 
                        </div>
                        <div class="story-text">
                            "I was skeptical about online dating, but DesireYourLove changed everything. James and I connected over our shared love of hiking and philosophy. Two years later, we're planning our wedding in the mountains where we had our first date!"
                        </div>
                        <div class="story-author">- Sarah & James, Married 2023</div>
                    </div>
                    
                    <div class="story-card fade-in">
                        <div class="story-image-placeholder">
                           <img src="images/pic2.webp" alt="Couple Photo: Maria & David"> 
                        </div>
                        <div class="story-text">
                            "After my divorce, I thought love was behind me. Then I met David through this amazing platform. He showed me that second chances at love can be even more beautiful than the first. We're expecting our first child together!"
                        </div>
                        <div class="story-author">- Maria & David, Engaged 2024</div>
                    </div>
                    
               
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about">
            <div class="container">
                <h2 class="section-title">Our Story</h2>
                <p class="section-subtitle">Born from the belief that everyone deserves to find their person, regardless of age, background, or past experiences.</p>
                
                <div class="about-grid">
                    <div class="about-text">
                        <h3>We Started With a Simple Question</h3>
                        <p>What if dating website actually helped people fall in love? Not just swipe endlessly, but truly connect with someone who gets them, understands their dreams, and shares their vision for the future?</p>
                        <p>After watching too many friends struggle with shallow connections and endless small talk, we decided to build something different. DesireYourLove focuses on the conversations that matter, the shared moments of laughter, and those butterflies you get when you meet someone truly special.</p>
                        <p>We're not just another dating website. We're your wingman, your confidant, and your biggest cheerleader in finding the love you deserve.</p>
                    </div>
                    <div class="about-image-placeholder">
                       <img src="images/sunset-happy-couple-e1425955022863.jpg" alt=" About Image: Two people laughing together, sunset background, genuine connection"> 
                    </div>
                </div>

                <div class="about-grid">
                    <div class="about-image-placeholder">
                     <img src="images/interracial.jpg" alt="Vision Image: Inclusive community montage, people of all backgrounds, ages, orientations">   
                    </div>
                    <div class="about-text">
                        <h3>Love for Everyone</h3>
                        <p>Love doesn't discriminate, and neither do we. Our community welcomes people of all backgrounds, orientations, ages, and love languages. Whether you're 22 or 72, looking for your first love or your last love, we believe everyone deserves a chance at happiness.</p>
                        <p>We've built inclusive features that respect different relationship styles, cultural backgrounds, and personal preferences. Our algorithm doesn't just match based on superficial criteria - it understands the deeper compatibility factors that make relationships work.</p>
                        <p>Because at the end of the day, love is love - and everyone deserves to find theirs, exactly as they are.</p>
                    </div>
                </div>

              
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq">
            <div class="container">
                <h2 class="section-title">Frequently Asked Questions</h2>
                <p class="section-subtitle">Got questions? We've got answers. Here's everything you need to know about finding love with DesireYourLove.</p>
                
                <div class="faq-container">
                    <div class="faq-item fade-in">
                        <div class="faq-question" onclick="toggleFaq(this)">
                            How does your matching system work?
                        </div>
                        <div class="faq-answer">
                            <p>We use a combination of your preferences, interests, values, and conversation patterns to suggest compatible matches. Our algorithm learns from your interactions to improve suggestions over time, focusing on long-term compatibility rather than just physical attraction. We also consider factors like life goals, communication style, and relationship readiness.</p>
                        </div>
                    </div>

                    <div class="faq-item fade-in">
                        <div class="faq-question" onclick="toggleFaq(this)">
                            Is DesireYourLove free to use?
                        </div>
                        <div class="faq-answer">
                            <p>Yes! You can create a profile, browse matches, and start conversations completely free. We also offer premium features like advanced filters, unlimited likes, read receipts, and priority support for those who want to supercharge their dating experience. Premium starts at just $19.99/month.</p>
                        </div>
                    </div>

                    <div class="faq-item fade-in">
                        <div class="faq-question" onclick="toggleFaq(this)">
                            How do you ensure user safety and authenticity?
                        </div>
                        <div class="faq-answer">
                            <p>Safety is our top priority. All profiles are manually reviewed within 24 hours, we offer photo verification, secure in-app messaging, and easy reporting tools. We use AI to detect suspicious behavior and have a dedicated safety team available 24/7. We also provide comprehensive dating safety tips and never share your personal information with other users.</p>
                        </div>
                    </div>

                    <div class="faq-item fade-in">
                        <div class="faq-question" onclick="toggleFaq(this)">
                            What makes you different from other dating websites?
                        </div>
                        <div class="faq-answer">
                            <p>We prioritize quality over quantity. Instead of endless swiping, we encourage meaningful conversations through thoughtful icebreakers and conversation starters. Our community guidelines promote respect and genuine connections. We also offer relationship coaching, date planning assistance, and follow-up support to help relationships flourish beyond the first date.</p>
                        </div>
                    </div>

                    <div class="faq-item fade-in">
                        <div class="faq-question" onclick="toggleFaq(this)">
                            Can I use the app if I'm over 50?
                        </div>
                        <div class="faq-answer">
                            <p>Absolutely! Love has no age limit, and our community includes people from 18 to 80+. We have specific features designed for mature daters, including life-stage matching, and many of our success stories involve people who found love later in life. Age is just a number when it comes to finding your perfect match.</p>
                        </div>
                    </div>

                    <div class="faq-item fade-in">
                        <div class="faq-question" onclick="toggleFaq(this)">
                            Do you support LGBTQ+ relationships?
                        </div>
                        <div class="faq-answer">
                            <p>Yes! We're proud to be an inclusive platform that welcomes people of all sexual orientations and gender identities. Our matching system includes comprehensive options for gender identity and sexual preference, and we have specific community guidelines to ensure a safe, respectful environment for everyone.</p>
                        </div>
                    </div>

                    <div class="faq-item fade-in">
                        <div class="faq-question" onclick="toggleFaq(this)">
                            Can I delete my account anytime?
                        </div>
                        <div class="faq-answer">
                            <p>Absolutely! You have full control over your account and data. You can pause your profile, delete it temporarily, or permanently remove all your information from our platform at any time through your settings. We also offer a "success story" option if you've found love and want to share your experience!</p>
                        </div>
                    </div>

                    <div class="faq-item fade-in">
                        <div class="faq-question" onclick="toggleFaq(this)">
                            How long does it typically take to find a match?
                        </div>
                        <div class="faq-answer">
                            <p>While every journey is unique, most of our users start having meaningful conversations within the first week. About 60% of our users go on their first date within a month, and the average time to find a serious relationship is 3-6 months. Remember, we focus on quality matches, not quantity, so patience often leads to better outcomes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <div class="container">
                <h2>Ready to Write Your Love Story?</h2>
                <p>Join over 200,000 people who are actively looking for meaningful connections. Your perfect match might be just one click away.</p>
                <a href="register.php" class="btn" >Join DesireYourLove Today</a>
            </div>
        </section>
    </div>
 <?php include 'includes/footer.php'; ?>
 

    <script>
    
        function toggleFaq(element) {
            const answer = element.nextElementSibling;
            const allQuestions = document.querySelectorAll('.faq-question');
            const allAnswers = document.querySelectorAll('.faq-answer');
            
            // Close all other FAQs
            allAnswers.forEach((ans, index) => {
                if (ans !== answer) {
                    ans.classList.remove('active');
                    allQuestions[index].classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            answer.classList.toggle('active');
            element.classList.toggle('active');
        }

        function toggleMobileMenu() {
            const navLinks = document.getElementById('navLinks');
            const toggle = document.querySelector('.mobile-menu-toggle');
            
            navLinks.classList.toggle('active');
            toggle.classList.toggle('active');
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.addEventListener('DOMContentLoaded', function() {
            const fadeElements = document.querySelectorAll('.fade-in');
            fadeElements.forEach(el => observer.observe(el));
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const navLinks = document.getElementById('navLinks');
            const toggle = document.querySelector('.mobile-menu-toggle');
            
            if (!toggle.contains(event.target) && !navLinks.contains(event.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Form validation and enhancement
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simple validation feedback
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;
                
                // Simulate form processing
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    alert('Form submitted! (This is a demo)');
                }, 2000);
            });
        });

        // Add loading states for buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.textContent.includes('Start Your Love Story') || this.textContent.includes('Join DesireYourLove')) {
                    const originalText = this.textContent;
                    this.textContent = 'Loading...';
                    setTimeout(() => {
                        this.textContent = originalText;
                    }, 1000);
                }
            });
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = document.getElementById('home');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        });
    </script>
   
</body>
</html>