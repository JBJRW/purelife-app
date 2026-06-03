<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PureLife Wellness Club · dr.smoothie.ai</title>

<!-- GSAP + Plugins -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js"></script>

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400&display=swap" rel="stylesheet">

<style>
/* ─── RESET & BASE ─────────────────────────────────────── */
*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --green: #00FF88;
  --green2: #00FFD0;
  --dark:  #030806;
  --dark2: #060f09;
  --mid:   #0a1a0d;
  --gold:  #C8A96E;
  --white: #F0F4F0;
}
html{scroll-behavior:auto;overflow-x:hidden;}
body{
  background:var(--dark);
  color:var(--white);
  font-family:'Syne',sans-serif;
  overflow-x:hidden;
  cursor:none;
}

/* ─── CUSTOM CURSOR ────────────────────────────────────── */
#cursor{position:fixed;width:12px;height:12px;background:var(--green);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);mix-blend-mode:exclusion;transition:transform .1s;}
#cursor-ring{position:fixed;width:44px;height:44px;border:1px solid rgba(0,255,136,.35);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:width .3s,height .3s,border-color .3s;}

/* ─── NAVBAR ───────────────────────────────────────────── */
nav{
  position:fixed;top:0;left:0;right:0;z-index:1000;
  padding:20px 48px;
  display:flex;align-items:center;justify-content:space-between;
  background:transparent;
  transition:background .5s,padding .5s;
}
nav.scrolled{background:rgba(3,8,6,.88);backdrop-filter:blur(20px);padding:14px 48px;border-bottom:1px solid rgba(0,255,136,.08);}
.nav-logo{
  font-family:'Cormorant Garamond',serif;
  font-size:22px;font-weight:700;letter-spacing:-.02em;
  color:var(--white);
}
.nav-logo span{color:var(--green);}
.nav-links{display:flex;gap:36px;list-style:none;}
.nav-links a{color:rgba(240,244,240,.5);font-size:13px;font-weight:600;text-decoration:none;letter-spacing:.05em;transition:color .3s;}
.nav-links a:hover{color:var(--green);}
.nav-cta{
  background:transparent;border:1px solid rgba(0,255,136,.4);
  color:var(--green);font-family:'Syne',sans-serif;font-weight:700;
  padding:10px 24px;font-size:13px;letter-spacing:.05em;
  cursor:none;transition:all .3s;
}
.nav-cta:hover{background:var(--green);color:#000;}

/* ─── LOADER ───────────────────────────────────────────── */
#loader{
  position:fixed;inset:0;background:var(--dark);z-index:9000;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;
}
.loader-word{
  font-family:'Cormorant Garamond',serif;font-size:clamp(40px,8vw,100px);
  font-style:italic;color:var(--green);letter-spacing:-.03em;overflow:hidden;
}
.loader-bar{width:200px;height:1px;background:rgba(0,255,136,.15);position:relative;overflow:hidden;}
.loader-bar::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:var(--green);animation:loadbar 1.8s ease forwards;}
@keyframes loadbar{to{left:100%;}}
.loader-pct{font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(0,255,136,.4);letter-spacing:.1em;}

/* ─── HERO ─────────────────────────────────────────────── */
#hero{
  height:100vh;position:relative;
  display:flex;align-items:center;justify-content:center;
  overflow:hidden;
}
.hero-bg{
  position:absolute;inset:0;
  background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,255,136,.07) 0%, transparent 60%),
              radial-gradient(ellipse 40% 50% at 80% 20%, rgba(0,255,208,.04) 0%, transparent 60%),
              var(--dark);
}
/* Animated grain overlay */
.grain{
  position:absolute;inset:0;opacity:.035;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:200px 200px;
  animation:grain 8s steps(10) infinite;
  pointer-events:none;
}
@keyframes grain{
  0%{transform:translate(0,0)}10%{transform:translate(-2%,-3%)}20%{transform:translate(3%,1%)}
  30%{transform:translate(-1%,4%)}40%{transform:translate(2%,-2%)}50%{transform:translate(-3%,3%)}
  60%{transform:translate(2%,2%)}70%{transform:translate(-2%,-1%)}80%{transform:translate(3%,-3%)}
  90%{transform:translate(-1%,2%)}100%{transform:translate(0,0)}
}

/* Parallax orbs */
.orb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none;}
.orb-1{width:600px;height:600px;background:radial-gradient(circle,rgba(0,255,136,.08),transparent 70%);top:-10%;left:-10%;}
.orb-2{width:400px;height:400px;background:radial-gradient(circle,rgba(0,255,208,.06),transparent 70%);bottom:0;right:-5%;}
.orb-3{width:300px;height:300px;background:radial-gradient(circle,rgba(200,169,110,.05),transparent 70%);top:30%;right:20%;}

/* Floating particles */
.particle{position:absolute;width:2px;height:2px;background:var(--green);border-radius:50%;opacity:0;}

/* Hero content */
.hero-content{
  position:relative;z-index:10;
  text-align:center;max-width:1000px;padding:0 24px;
}
.hero-eyebrow{
  font-family:'JetBrains Mono',monospace;font-size:11px;
  color:var(--green);letter-spacing:.2em;
  display:flex;align-items:center;justify-content:center;gap:12px;
  margin-bottom:32px;opacity:0;
}
.hero-eyebrow::before,.hero-eyebrow::after{
  content:'';width:40px;height:1px;background:rgba(0,255,136,.4);
}
.hero-title{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(52px,9vw,130px);
  font-weight:300;line-height:.92;letter-spacing:-.03em;
  color:var(--white);margin-bottom:8px;overflow:hidden;
}
.hero-title .italic{font-style:italic;color:var(--green);}
.hero-title .line{display:block;overflow:hidden;}
.hero-title .word{display:inline-block;transform:translateY(110%);}
.hero-sub{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(18px,2.5vw,26px);font-style:italic;
  color:rgba(240,244,240,.45);margin-bottom:52px;opacity:0;
}
.hero-actions{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;opacity:0;}
.btn-primary{
  background:var(--green);color:#000;
  font-family:'Syne',sans-serif;font-weight:800;
  font-size:13px;letter-spacing:.06em;
  padding:16px 40px;border:none;cursor:none;
  position:relative;overflow:hidden;
  clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));
  transition:all .4s;
}
.btn-primary::before{
  content:'';position:absolute;inset:0;
  background:var(--green2);transform:scaleX(0);transform-origin:left;
  transition:transform .4s cubic-bezier(.76,0,.24,1);
}
.btn-primary:hover::before{transform:scaleX(1);}
.btn-primary span{position:relative;z-index:1;}
.btn-outline{
  background:transparent;color:var(--white);
  font-family:'Syne',sans-serif;font-weight:600;
  font-size:13px;letter-spacing:.06em;
  padding:16px 40px;border:1px solid rgba(240,244,240,.2);
  cursor:none;transition:all .4s;
}
.btn-outline:hover{border-color:var(--green);color:var(--green);}

/* Scroll indicator */
.scroll-hint{
  position:absolute;bottom:36px;left:50%;transform:translateX(-50%);
  display:flex;flex-direction:column;align-items:center;gap:8px;
  opacity:0;
}
.scroll-line{width:1px;height:60px;background:linear-gradient(to bottom,transparent,var(--green));animation:scrollpulse 2s ease-in-out infinite;}
@keyframes scrollpulse{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1)}100%{transform:scaleY(0);transform-origin:bottom}}
.scroll-text{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.2em;color:rgba(0,255,136,.4);}

/* ─── MARQUEE ──────────────────────────────────────────── */
.marquee-section{
  padding:32px 0;
  border-top:1px solid rgba(0,255,136,.07);
  border-bottom:1px solid rgba(0,255,136,.07);
  overflow:hidden;background:rgba(0,255,136,.02);
}
.marquee-track{
  display:flex;gap:60px;white-space:nowrap;
  animation:marquee 30s linear infinite;
}
.marquee-track.reverse{animation:marquee-r 25s linear infinite;}
.marquee-item{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(14px,2vw,18px);
  font-style:italic;color:rgba(0,255,136,.35);
  letter-spacing:.05em;flex-shrink:0;
  display:flex;align-items:center;gap:20px;
}
.marquee-dot{width:4px;height:4px;border-radius:50%;background:rgba(0,255,136,.25);flex-shrink:0;}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes marquee-r{from{transform:translateX(-50%)}to{transform:translateX(0)}}

/* ─── ABOUT / PHILOSOPHY ───────────────────────────────── */
#philosophy{
  padding:140px 0;position:relative;overflow:hidden;
}
.philosophy-grid{
  max-width:1200px;margin:0 auto;padding:0 48px;
  display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;
}
.philosophy-number{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(120px,15vw,200px);font-weight:300;
  color:rgba(0,255,136,.04);line-height:1;
  position:absolute;left:-20px;top:50%;transform:translateY(-50%);
  pointer-events:none;
}
.philosophy-tag{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--green);letter-spacing:.2em;margin-bottom:20px;
  display:flex;align-items:center;gap:10px;
}
.philosophy-tag::before{content:'';width:30px;height:1px;background:var(--green);}
.philosophy-h2{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(36px,4.5vw,62px);font-weight:300;
  line-height:1.05;letter-spacing:-.02em;color:var(--white);
  margin-bottom:24px;
}
.philosophy-h2 em{font-style:italic;color:var(--green);}
.philosophy-p{
  color:rgba(240,244,240,.5);font-size:16px;line-height:1.85;
  font-family:'Syne',sans-serif;font-weight:400;
  margin-bottom:40px;
}

/* Ingredient cards parallax */
.ingredient-stack{position:relative;height:500px;}
.ing-card{
  position:absolute;
  background:var(--mid);
  border:1px solid rgba(0,255,136,.12);
  border-radius:4px;
  padding:20px;
  width:200px;
  will-change:transform;
  transition:box-shadow .4s;
}
.ing-card:hover{box-shadow:0 20px 60px rgba(0,255,136,.15);}
.ing-card-emoji{font-size:40px;margin-bottom:10px;display:block;}
.ing-card-name{font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--white);font-weight:300;}
.ing-card-benefit{font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(0,255,136,.5);margin-top:6px;}
.ing-card.c1{top:0;left:10%;transform:rotate(-3deg);}
.ing-card.c2{top:20%;left:40%;transform:rotate(2deg);}
.ing-card.c3{top:10%;right:5%;transform:rotate(-1deg);}
.ing-card.c4{bottom:15%;left:5%;transform:rotate(3deg);}
.ing-card.c5{bottom:5%;right:10%;transform:rotate(-2deg);}

/* ─── FEATURES / PILLARS ───────────────────────────────── */
#features{
  padding:120px 0;
  background:linear-gradient(to bottom,var(--dark),var(--dark2),var(--dark));
}
.features-container{max-width:1200px;margin:0 auto;padding:0 48px;}
.section-header{text-align:center;margin-bottom:90px;}
.section-tag{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--green);letter-spacing:.2em;margin-bottom:16px;
  display:block;
}
.section-h2{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(38px,5vw,68px);font-weight:300;
  line-height:1.05;color:var(--white);letter-spacing:-.02em;
}
.section-h2 em{font-style:italic;color:var(--green);}
.features-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:2px;
}
.feature-item{
  background:var(--mid);padding:48px 36px;
  border:1px solid rgba(0,255,136,.06);
  position:relative;overflow:hidden;
  transition:transform .5s cubic-bezier(.34,1.56,.64,1);
}
.feature-item::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(0,255,136,.04),transparent);
  opacity:0;transition:opacity .4s;
}
.feature-item:hover{transform:translateY(-8px);}
.feature-item:hover::before{opacity:1;}
.feature-number{
  font-family:'Cormorant Garamond',serif;
  font-size:72px;font-weight:300;
  color:rgba(0,255,136,.06);
  position:absolute;top:16px;right:24px;line-height:1;
}
.feature-icon{font-size:36px;margin-bottom:20px;display:block;}
.feature-h3{
  font-family:'Cormorant Garamond',serif;
  font-size:24px;font-weight:400;color:var(--white);
  margin-bottom:12px;
}
.feature-p{
  color:rgba(240,244,240,.45);font-size:14px;line-height:1.8;
}
.feature-tag-pill{
  display:inline-block;margin-top:20px;
  background:rgba(0,255,136,.08);
  border:1px solid rgba(0,255,136,.15);
  color:var(--green);font-family:'JetBrains Mono',monospace;
  font-size:10px;letter-spacing:.1em;padding:4px 12px;border-radius:20px;
}

/* ─── EXPAND IMAGES SECTION ────────────────────────────── */
#gallery{
  padding:120px 0;overflow:hidden;
}
.gallery-container{max-width:1400px;margin:0 auto;padding:0 24px;}
.gallery-intro{
  max-width:600px;margin:0 auto 80px;text-align:center;
}
/* The cinematic expanding cards */
.gallery-track{
  display:flex;gap:16px;align-items:stretch;height:500px;
}
.gallery-card{
  position:relative;overflow:hidden;border-radius:4px;
  flex:1;cursor:none;
  border:1px solid rgba(0,255,136,.08);
  transition:flex .8s cubic-bezier(.76,0,.24,1);
  min-width:80px;
}
.gallery-card.active{flex:4;}
.gallery-card-bg{
  position:absolute;inset:0;
  background-size:cover;background-position:center;
  transform:scale(1.1);
  transition:transform .8s cubic-bezier(.76,0,.24,1);
  filter:brightness(.4);
}
.gallery-card.active .gallery-card-bg{
  transform:scale(1);filter:brightness(.6);
}
.gallery-card-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(3,8,6,.95) 0%,transparent 50%);
}
.gallery-card-content{
  position:absolute;bottom:0;left:0;right:0;padding:32px 28px;
  transform:translateY(20px);opacity:0;
  transition:all .6s cubic-bezier(.34,1.56,.64,1) .2s;
}
.gallery-card.active .gallery-card-content{transform:translateY(0);opacity:1;}
.gallery-card-label{
  font-family:'JetBrains Mono',monospace;font-size:9px;
  color:var(--green);letter-spacing:.2em;margin-bottom:8px;
}
.gallery-card-title{
  font-family:'Cormorant Garamond',serif;font-size:28px;
  color:var(--white);font-weight:300;line-height:1.2;margin-bottom:8px;
}
.gallery-card-desc{
  font-size:13px;color:rgba(240,244,240,.6);line-height:1.7;
}
.gallery-card-side-label{
  position:absolute;
  top:50%;left:50%;
  transform:translate(-50%,-50%) rotate(-90deg);
  font-family:'Cormorant Garamond',serif;font-size:14px;
  color:rgba(240,244,240,.3);white-space:nowrap;
  transition:opacity .4s;
}
.gallery-card.active .gallery-card-side-label{opacity:0;}

/* ─── AI STATS ─────────────────────────────────────────── */
#stats{
  padding:120px 0;
  background:var(--dark2);
}
.stats-grid{
  max-width:1200px;margin:0 auto;padding:0 48px;
  display:grid;grid-template-columns:repeat(4,1fr);gap:1px;
  background:rgba(0,255,136,.06);
}
.stat-item{
  background:var(--dark2);padding:56px 40px;text-align:center;
  position:relative;overflow:hidden;
}
.stat-item::before{
  content:'';position:absolute;bottom:0;left:0;right:0;
  height:2px;background:linear-gradient(to right,transparent,var(--green),transparent);
  transform:scaleX(0);transition:transform .6s;
}
.stat-item:hover::before{transform:scaleX(1);}
.stat-number{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(48px,5vw,72px);font-weight:300;
  color:var(--green);line-height:1;margin-bottom:12px;
}
.stat-label{
  font-family:'Syne',sans-serif;font-size:13px;
  color:rgba(240,244,240,.4);letter-spacing:.05em;
}
.stat-sub{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:rgba(0,255,136,.3);margin-top:6px;
}

/* ─── HORIZONTAL SCROLL SECTION ───────────────────────── */
#horiz{
  overflow:hidden;
}
.horiz-outer{
  height:400vh;position:relative;
}
.horiz-sticky{
  position:sticky;top:0;height:100vh;overflow:hidden;
}
.horiz-track{
  display:flex;height:100%;align-items:center;
  width:400%;will-change:transform;
}
.horiz-panel{
  width:100vw;height:100vh;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  padding:60px;
}
.horiz-panel-inner{
  max-width:700px;text-align:center;
}
.panel-step{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:var(--green);letter-spacing:.2em;margin-bottom:20px;display:block;
}
.panel-h2{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(36px,5vw,68px);font-weight:300;
  color:var(--white);line-height:1.05;margin-bottom:24px;
}
.panel-h2 em{font-style:italic;color:var(--green);}
.panel-p{
  color:rgba(240,244,240,.5);font-size:16px;line-height:1.9;
  font-family:'Syne',sans-serif;
}

/* Horizontal progress */
.horiz-progress{
  position:absolute;bottom:40px;left:50%;transform:translateX(-50%);
  display:flex;gap:8px;
}
.prog-dot{
  width:6px;height:6px;border-radius:50%;
  background:rgba(240,244,240,.15);
  transition:background .4s,transform .4s;
}
.prog-dot.active{background:var(--green);transform:scale(1.5);}

/* ─── MEMBERSHIP TIERS ─────────────────────────────────── */
#tiers{
  padding:120px 0;
}
.tiers-container{max-width:1200px;margin:0 auto;padding:0 48px;}
.tiers-grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:24px;
  margin-top:80px;
}
.tier-card{
  border:1px solid rgba(0,255,136,.1);
  padding:48px 36px;
  position:relative;overflow:hidden;
  transition:all .6s cubic-bezier(.34,1.56,.64,1);
  background:rgba(10,26,13,.3);
  backdrop-filter:blur(10px);
}
.tier-card::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(0,255,136,.05),transparent);
  opacity:0;transition:opacity .5s;
}
.tier-card.featured{
  border-color:rgba(0,255,136,.35);
  background:rgba(10,26,13,.6);
  transform:scale(1.03);
  box-shadow:0 0 80px rgba(0,255,136,.08);
}
.tier-card.featured::before{opacity:1;}
.tier-card:hover{transform:translateY(-12px) scale(1.01);box-shadow:0 30px 80px rgba(0,255,136,.12);}
.tier-card.featured:hover{transform:translateY(-12px) scale(1.04);}
.tier-badge{
  position:absolute;top:0;right:32px;
  background:var(--green);color:#000;
  font-family:'Syne',sans-serif;font-weight:800;font-size:10px;
  padding:6px 14px;letter-spacing:.08em;
}
.tier-emoji{font-size:48px;margin-bottom:20px;display:block;}
.tier-name{
  font-family:'Cormorant Garamond',serif;
  font-size:28px;font-weight:400;color:var(--white);margin-bottom:4px;
}
.tier-price{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(42px,4vw,58px);color:var(--green);
  font-weight:300;line-height:1;margin:20px 0;
}
.tier-price sup{font-size:.5em;vertical-align:top;margin-top:12px;display:inline-block;}
.tier-price sub{font-size:.3em;color:rgba(240,244,240,.3);}
.tier-divider{height:1px;background:rgba(0,255,136,.1);margin:24px 0;}
.tier-feature{
  display:flex;align-items:center;gap:12px;
  font-size:14px;color:rgba(240,244,240,.6);
  margin-bottom:12px;font-family:'Syne',sans-serif;
}
.tier-feature::before{content:'→';color:var(--green);font-size:12px;flex-shrink:0;}
.tier-btn{
  width:100%;margin-top:32px;padding:16px;border:1px solid rgba(0,255,136,.4);
  background:transparent;color:var(--green);
  font-family:'Syne',sans-serif;font-weight:700;font-size:13px;
  letter-spacing:.08em;cursor:none;transition:all .4s;
  position:relative;overflow:hidden;
}
.tier-btn::before{
  content:'';position:absolute;inset:0;
  background:var(--green);transform:translateY(100%);transition:transform .4s cubic-bezier(.76,0,.24,1);
}
.tier-btn:hover::before{transform:translateY(0);}
.tier-btn span{position:relative;z-index:1;transition:color .4s;}
.tier-btn:hover span{color:#000;}
.tier-card.featured .tier-btn{background:var(--green);}
.tier-card.featured .tier-btn span{color:#000;}
.tier-card.featured .tier-btn::before{background:var(--green2);}

/* ─── CTA ──────────────────────────────────────────────── */
#cta{
  padding:160px 0;
  position:relative;overflow:hidden;
  background:linear-gradient(to bottom,var(--dark2),var(--dark));
}
.cta-bg{
  position:absolute;inset:0;
  background:radial-gradient(ellipse 70% 80% at 50% 100%,rgba(0,255,136,.06),transparent 70%);
}
.cta-container{
  max-width:900px;margin:0 auto;padding:0 48px;text-align:center;
  position:relative;z-index:1;
}
.cta-h2{
  font-family:'Cormorant Garamond',serif;
  font-size:clamp(44px,7vw,96px);font-weight:300;
  line-height:.95;letter-spacing:-.03em;color:var(--white);
  margin-bottom:36px;
}
.cta-h2 em{font-style:italic;color:var(--green);}
.cta-p{
  color:rgba(240,244,240,.4);font-size:17px;line-height:1.8;
  font-family:'Syne',sans-serif;max-width:560px;margin:0 auto 52px;
}
.cta-line{
  height:1px;background:linear-gradient(to right,transparent,rgba(0,255,136,.3),transparent);
  margin:60px 0;
}

/* ─── FOOTER ───────────────────────────────────────────── */
footer{
  padding:40px 48px;
  border-top:1px solid rgba(0,255,136,.06);
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:16px;
}
.footer-logo{
  font-family:'Cormorant Garamond',serif;font-size:18px;
  color:rgba(240,244,240,.3);
}
.footer-logo span{color:rgba(0,255,136,.4);}
.footer-note{
  font-family:'JetBrains Mono',monospace;font-size:10px;
  color:rgba(240,244,240,.15);
}

/* ─── UTILITIES ────────────────────────────────────────── */
.clip-text{
  background:linear-gradient(135deg,var(--white),rgba(240,244,240,.6));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
}
.reveal{opacity:0;transform:translateY(40px);}
</style>
</head>
<body>

<!-- CURSOR -->
<div id="cursor"></div>
<div id="cursor-ring"></div>

<!-- LOADER -->
<div id="loader">
  <div class="loader-word">PureLife</div>
  <div class="loader-bar"></div>
  <div class="loader-pct" id="loader-pct">Loading experience... 0%</div>
</div>

<!-- NAV -->
<nav id="navbar">
  <div class="nav-logo">Pure<span>Life</span></div>
  <ul class="nav-links">
    <li><a href="#philosophy">Filosofía</a></li>
    <li><a href="#features">IA</a></li>
    <li><a href="#gallery">Ingredientes</a></li>
    <li><a href="#tiers">Planes</a></li>
  </ul>
  <button class="nav-cta">Comenzar →</button>
</nav>

<!-- ─── HERO ──────────────────────────────────────────── -->
<section id="hero">
  <div class="hero-bg"></div>
  <div class="grain"></div>
  <div class="orb orb-1" id="orb1"></div>
  <div class="orb orb-2" id="orb2"></div>
  <div class="orb orb-3" id="orb3"></div>

  <!-- Particles -->
  <div id="particles"></div>

  <div class="hero-content">
    <div class="hero-eyebrow">DR.SMOOTHIE.AI · WELLNESS CLUB · EST. 2026</div>
    <h1 class="hero-title">
      <span class="line"><span class="word">Tu bienestar,</span></span>
      <span class="line"><span class="word italic">redefinido</span></span>
      <span class="line"><span class="word">por la IA.</span></span>
    </h1>
    <p class="hero-sub">Ingredientes reales. Inteligencia real. Resultados reales.</p>
    <div class="hero-actions">
      <button class="btn-primary"><span>Empezar ahora →</span></button>
      <button class="btn-outline">Ver demo</button>
    </div>
  </div>

  <div class="scroll-hint">
    <div class="scroll-line"></div>
    <span class="scroll-text">SCROLL</span>
  </div>
</section>

<!-- MARQUEE 1 -->
<div class="marquee-section">
  <div class="marquee-track" id="marq1">
    <div class="marquee-item"><span class="marquee-dot"></span>Inteligencia Artificial Nutricional</div>
    <div class="marquee-item"><span class="marquee-dot"></span>Combinaciones Personalizadas</div>
    <div class="marquee-item"><span class="marquee-dot"></span>Swarm Intelligence</div>
    <div class="marquee-item"><span class="marquee-dot"></span>Bienestar Basado en Datos</div>
    <div class="marquee-item"><span class="marquee-dot"></span>Video Agent con Avatar IA</div>
    <div class="marquee-item"><span class="marquee-dot"></span>dr.smoothie.ai</div>
    <!-- duplicate -->
    <div class="marquee-item"><span class="marquee-dot"></span>Inteligencia Artificial Nutricional</div>
    <div class="marquee-item"><span class="marquee-dot"></span>Combinaciones Personalizadas</div>
    <div class="marquee-item"><span class="marquee-dot"></span>Swarm Intelligence</div>
    <div class="marquee-item"><span class="marquee-dot"></span>Bienestar Basado en Datos</div>
    <div class="marquee-item"><span class="marquee-dot"></span>Video Agent con Avatar IA</div>
    <div class="marquee-item"><span class="marquee-dot"></span>dr.smoothie.ai</div>
  </div>
</div>

<!-- ─── PHILOSOPHY ─────────────────────────────────────── -->
<section id="philosophy">
  <div class="philosophy-grid">
    <div style="position:relative;">
      <div class="philosophy-number">01</div>
      <div class="philosophy-tag">NUESTRA FILOSOFÍA</div>
      <h2 class="philosophy-h2">La naturaleza tiene<br>las <em>respuestas.</em><br>La IA las encuentra.</h2>
      <p class="philosophy-p">Cada ingrediente tiene propiedades documentadas. Cada combinación tiene una sinergia específica. PureLife Wellness Club usa inteligencia artificial para descifrar esas relaciones y darte exactamente lo que tu cuerpo necesita.</p>
      <div style="display:flex;gap:32px;flex-wrap:wrap;">
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:42px;color:var(--green);font-weight:300;">200+</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(240,244,240,.4);letter-spacing:.1em;">INGREDIENTES</div>
        </div>
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:42px;color:var(--green);font-weight:300;">98%</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(240,244,240,.4);letter-spacing:.1em;">PRECISIÓN IA</div>
        </div>
        <div>
          <div style="font-family:'Cormorant Garamond',serif;font-size:42px;color:var(--green);font-weight:300;">24/7</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(240,244,240,.4);letter-spacing:.1em;">DISPONIBLE</div>
        </div>
      </div>
    </div>
    <div class="ingredient-stack" id="ingStack">
      <div class="ing-card c1"><span class="ing-card-emoji">🫚</span><div class="ing-card-name">Cúrcuma</div><div class="ing-card-benefit">Anti-inflamatoria · Hígado</div></div>
      <div class="ing-card c2"><span class="ing-card-emoji">🫐</span><div class="ing-card-name">Arándanos</div><div class="ing-card-benefit">Antioxidante · Memoria</div></div>
      <div class="ing-card c3"><span class="ing-card-emoji">🥬</span><div class="ing-card-name">Kale</div><div class="ing-card-benefit">Vitamina A · Calcio</div></div>
      <div class="ing-card c4"><span class="ing-card-emoji">🫚</span><div class="ing-card-name">Jengibre</div><div class="ing-card-benefit">Digestión · Inmunidad</div></div>
      <div class="ing-card c5"><span class="ing-card-emoji">🍍</span><div class="ing-card-name">Piña</div><div class="ing-card-benefit">Bromelina · Vitamina C</div></div>
    </div>
  </div>
</section>

<!-- ─── FEATURES ───────────────────────────────────────── -->
<section id="features">
  <div class="features-container">
    <div class="section-header">
      <span class="section-tag">TECNOLOGÍA APLICADA</span>
      <h2 class="section-h2">Ciencia al servicio<br>de tu <em>bienestar</em></h2>
    </div>
    <div class="features-grid">
      <div class="feature-item reveal">
        <div class="feature-number">01</div>
        <span class="feature-icon">🤖</span>
        <h3 class="feature-h3">IA Conversacional</h3>
        <p class="feature-p">Análisis instantáneo de ingredientes con Claude AI. Respuestas basadas en propiedades reales, no suposiciones.</p>
        <span class="feature-tag-pill">CLAUDE SONNET</span>
      </div>
      <div class="feature-item reveal">
        <div class="feature-number">02</div>
        <span class="feature-icon">🌊</span>
        <h3 class="feature-h3">Swarm Intelligence</h3>
        <p class="feature-p">6 agentes especializados votan en paralelo para encontrar la combinación óptima para tu objetivo de salud.</p>
        <span class="feature-tag-pill">MIROFISH ENGINE</span>
      </div>
      <div class="feature-item reveal">
        <div class="feature-number">03</div>
        <span class="feature-icon">🎬</span>
        <h3 class="feature-h3">Video Agent</h3>
        <p class="feature-p">Genera videos con tu avatar de IA. Script + voz + imagen en menos de 3 minutos.</p>
        <span class="feature-tag-pill">HEYGEN V2</span>
      </div>
    </div>
  </div>
</section>

<!-- ─── GALLERY (Expanding Cards) ─────────────────────── -->
<section id="gallery">
  <div class="gallery-container">
    <div class="gallery-intro">
      <span class="section-tag">INGREDIENTES ESTRELLA</span>
      <h2 class="section-h2" style="font-size:clamp(32px,4vw,52px);">Cada elemento,<br><em>una historia</em></h2>
    </div>
    <div class="gallery-track" id="galleryTrack">
      <div class="gallery-card active" data-idx="0">
        <div class="gallery-card-bg" style="background-color:#0a1a0a;background-image:linear-gradient(135deg,#0a1a0a 0%,#0d2b12 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:80px;opacity:.15;">🫚</div>
        <div class="gallery-card-overlay"></div>
        <div class="gallery-card-content">
          <div class="gallery-card-label">SUPERALIMENTO #01</div>
          <div class="gallery-card-title">Jengibre & Cúrcuma</div>
          <div class="gallery-card-desc">La dupla anti-inflamatoria más potente de la naturaleza. La piperina activa la curcumina 20x.</div>
        </div>
        <div class="gallery-card-side-label">Jengibre</div>
      </div>
      <div class="gallery-card" data-idx="1">
        <div class="gallery-card-bg" style="background-color:#0a1520;background-image:linear-gradient(135deg,#0a1520 0%,#0d1f35 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:80px;opacity:.15;">🫐</div>
        <div class="gallery-card-overlay"></div>
        <div class="gallery-card-content">
          <div class="gallery-card-label">SUPERALIMENTO #02</div>
          <div class="gallery-card-title">Arándanos Silvestres</div>
          <div class="gallery-card-desc">Antocianinas que cruzan la barrera hematoencefálica. Neuroprotección real.</div>
        </div>
        <div class="gallery-card-side-label">Arándanos</div>
      </div>
      <div class="gallery-card" data-idx="2">
        <div class="gallery-card-bg" style="background-color:#1a0a0a;background-image:linear-gradient(135deg,#1a0a0a 0%,#2b0d0d 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:80px;opacity:.15;">🍍</div>
        <div class="gallery-card-overlay"></div>
        <div class="gallery-card-content">
          <div class="gallery-card-label">SUPERALIMENTO #03</div>
          <div class="gallery-card-title">Piña & Bromelina</div>
          <div class="gallery-card-desc">Enzima digestiva excepcional. Potencia la absorción de todos los nutrientes.</div>
        </div>
        <div class="gallery-card-side-label">Piña</div>
      </div>
      <div class="gallery-card" data-idx="3">
        <div class="gallery-card-bg" style="background-color:#0a150a;background-image:linear-gradient(135deg,#0a150a 0%,#0d200d 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:80px;opacity:.15;">🥬</div>
        <div class="gallery-card-overlay"></div>
        <div class="gallery-card-content">
          <div class="gallery-card-label">SUPERALIMENTO #04</div>
          <div class="gallery-card-title">Espinaca & Kale</div>
          <div class="gallery-card-desc">Hierro, calcio y vitamina K. El combo verde que sostiene tu energía todo el día.</div>
        </div>
        <div class="gallery-card-side-label">Verdes</div>
      </div>
      <div class="gallery-card" data-idx="4">
        <div class="gallery-card-bg" style="background-color:#15100a;background-image:linear-gradient(135deg,#15100a 0%,#241a0d 100%);"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:80px;opacity:.15;">🥥</div>
        <div class="gallery-card-overlay"></div>
        <div class="gallery-card-content">
          <div class="gallery-card-label">SUPERALIMENTO #05</div>
          <div class="gallery-card-title">Coco & Chía</div>
          <div class="gallery-card-desc">MCT para el cerebro. Omega-3 vegetal. La base energética perfecta.</div>
        </div>
        <div class="gallery-card-side-label">Coco</div>
      </div>
    </div>
  </div>
</section>

<!-- ─── STATS ──────────────────────────────────────────── -->
<section id="stats">
  <div class="stats-grid">
    <div class="stat-item">
      <div class="stat-number" data-target="200">0</div>
      <div class="stat-label">Ingredientes</div>
      <div class="stat-sub">BASE DE DATOS VIVA</div>
    </div>
    <div class="stat-item">
      <div class="stat-number" data-target="98" data-suffix="%">0</div>
      <div class="stat-label">Precisión IA</div>
      <div class="stat-sub">VALIDADO EN TESTS</div>
    </div>
    <div class="stat-item">
      <div class="stat-number" data-target="45" data-suffix="s">0</div>
      <div class="stat-label">Tiempo de respuesta</div>
      <div class="stat-sub">PROMEDIO</div>
    </div>
    <div class="stat-item">
      <div class="stat-number" data-target="3" data-suffix="k+">0</div>
      <div class="stat-label">Miembros activos</div>
      <div class="stat-sub">Y CRECIENDO</div>
    </div>
  </div>
</section>

<!-- ─── HORIZONTAL SCROLL ─────────────────────────────── -->
<section id="horiz">
  <div class="horiz-outer" id="horizOuter">
    <div class="horiz-sticky" id="horizSticky">
      <div class="horiz-track" id="horizTrack">
        <!-- Panel 1 -->
        <div class="horiz-panel" style="background:var(--dark);">
          <div class="horiz-panel-inner">
            <span class="panel-step">PASO 01 / 04</span>
            <h2 class="panel-h2">Dinos tu <em>objetivo</em><br>de bienestar</h2>
            <p class="panel-p">Energía, sueño, anti-inflamatorio, detox, cerebro. Solo con palabras naturales — sin códigos ni tecnicismos.</p>
          </div>
        </div>
        <!-- Panel 2 -->
        <div class="horiz-panel" style="background:var(--dark2);">
          <div class="horiz-panel-inner">
            <span class="panel-step">PASO 02 / 04</span>
            <h2 class="panel-h2">La IA analiza<br><em>6 dimensiones</em></h2>
            <p class="panel-p">Nuestro motor swarm lanza 6 agentes especializados: bioquímica, sinergia, biodisponibilidad, contraindicaciones, sabor y temporada.</p>
          </div>
        </div>
        <!-- Panel 3 -->
        <div class="horiz-panel" style="background:var(--dark);">
          <div class="horiz-panel-inner">
            <span class="panel-step">PASO 03 / 04</span>
            <h2 class="panel-h2">Recibes la<br><em>fórmula exacta</em></h2>
            <p class="panel-p">Ingredientes específicos, cantidades en gramos, momento del día y temperatura óptima. Sin ambigüedad.</p>
          </div>
        </div>
        <!-- Panel 4 -->
        <div class="horiz-panel" style="background:var(--dark2);">
          <div class="horiz-panel-inner">
            <span class="panel-step">PASO 04 / 04</span>
            <h2 class="panel-h2">Tu bienestar<br><em>evoluciona</em></h2>
            <p class="panel-p">El sistema aprende tus preferencias, registra tu progreso y ajusta las recomendaciones con cada interacción.</p>
          </div>
        </div>
      </div>
      <!-- Progress dots -->
      <div class="horiz-progress" id="horizProgress">
        <div class="prog-dot active" data-step="0"></div>
        <div class="prog-dot" data-step="1"></div>
        <div class="prog-dot" data-step="2"></div>
        <div class="prog-dot" data-step="3"></div>
      </div>
    </div>
  </div>
</section>

<!-- ─── TIERS ──────────────────────────────────────────── -->
<section id="tiers">
  <div class="tiers-container">
    <div class="section-header">
      <span class="section-tag">MEMBRESÍAS</span>
      <h2 class="section-h2">Elige cómo quieres<br><em>transformarte</em></h2>
    </div>
    <div class="tiers-grid">
      <div class="tier-card reveal">
        <span class="tier-emoji">🌱</span>
        <div class="tier-name">Seed</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(0,255,136,.4);margin-bottom:16px;">INICIO CONSCIENTE</div>
        <div class="tier-price"><sup>$</sup>29<sub>/mes</sub></div>
        <div class="tier-divider"></div>
        <div class="tier-feature">1 consulta IA por día</div>
        <div class="tier-feature">Recetas básicas</div>
        <div class="tier-feature">1 simulación swarm</div>
        <div class="tier-feature">Base de datos 200+ ingredientes</div>
        <button class="tier-btn"><span>Comenzar con Seed</span></button>
      </div>
      <div class="tier-card featured reveal">
        <div class="tier-badge">MÁS POPULAR</div>
        <span class="tier-emoji">🌸</span>
        <div class="tier-name">Bloom</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(0,255,136,.4);margin-bottom:16px;">CRECIMIENTO REAL</div>
        <div class="tier-price"><sup>$</sup>49<sub>/mes</sub></div>
        <div class="tier-divider"></div>
        <div class="tier-feature">Chat IA ilimitado</div>
        <div class="tier-feature">Video Agent incluido</div>
        <div class="tier-feature">5 simulaciones swarm</div>
        <div class="tier-feature">Análisis avanzado</div>
        <div class="tier-feature">Historial completo</div>
        <button class="tier-btn"><span>Comenzar con Bloom</span></button>
      </div>
      <div class="tier-card reveal">
        <span class="tier-emoji">🌳</span>
        <div class="tier-name">Canopy</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:rgba(0,255,136,.4);margin-bottom:16px;">MÁXIMO POTENCIAL</div>
        <div class="tier-price"><sup>$</sup>79<sub>/mes</sub></div>
        <div class="tier-divider"></div>
        <div class="tier-feature">Todo lo de Bloom</div>
        <div class="tier-feature">Avatar HeyGen personalizado</div>
        <div class="tier-feature">Swarm ilimitado</div>
        <div class="tier-feature">Acceso a API</div>
        <div class="tier-feature">Soporte prioritario</div>
        <button class="tier-btn"><span>Comenzar con Canopy</span></button>
      </div>
    </div>
  </div>
</section>

<!-- ─── CTA ───────────────────────────────────────────── -->
<section id="cta">
  <div class="cta-bg"></div>
  <div class="cta-container">
    <div class="cta-h2 reveal">Tu mejor versión<br>empieza con un<br><em>ingrediente.</em></div>
    <p class="cta-p reveal">Miles de combinaciones posibles. Una respuesta exacta para ti. La IA que transforma tu bienestar, cada día.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap;" class="reveal">
      <button class="btn-primary"><span>Unirme a PureLife →</span></button>
      <button class="btn-outline">Hablar con dr.smoothie</button>
    </div>
    <div class="cta-line"></div>
    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(240,244,240,.15);letter-spacing:.1em;">
      JRMB FOOD NETWORK LLC · PURELIFEWELLNESSCLUB.ORG · DR.SMOOTHIE.AI
    </div>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-logo">Pure<span>Life</span> · dr.smoothie<span>.ai</span></div>
  <div class="footer-note">© 2026 JRMB Food Network LLC · No es consejo médico</div>
</footer>

<!-- ─── JAVASCRIPT ──────────────────────────────────────── -->
<script>
gsap.registerPlugin(ScrollTrigger, TextPlugin, CustomEase);

CustomEase.create("cinematic", "0.76, 0, 0.24, 1");
CustomEase.create("bounce", "0.34, 1.56, 0.64, 1");

// ── CURSOR ───────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mouseX=0, mouseY=0, ringX=0, ringY=0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  gsap.to(cursor, { x:mouseX, y:mouseY, duration:.1 });
});
function lerp(a,b,t){ return a+(b-a)*t; }
(function animateRing(){
  ringX = lerp(ringX,mouseX,.1);
  ringY = lerp(ringY,mouseY,.1);
  ring.style.left = ringX+'px';
  ring.style.top  = ringY+'px';
  requestAnimationFrame(animateRing);
})();
document.querySelectorAll('a,button,.gallery-card,.tier-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>gsap.to([cursor,ring],{scale:2,duration:.3,ease:'bounce'}));
  el.addEventListener('mouseleave',()=>gsap.to([cursor,ring],{scale:1,duration:.3,ease:'bounce'}));
});

// ── LOADER ───────────────────────────────────────────────
const pct = document.getElementById('loader-pct');
let count = 0;
const interval = setInterval(()=>{
  count += Math.floor(Math.random()*8)+3;
  if(count>=100){ count=100; clearInterval(interval); }
  pct.textContent = `Loading experience... ${count}%`;
},60);

window.addEventListener('load', ()=>{
  setTimeout(()=>{
    gsap.to('#loader', {
      opacity:0, yPercent:-100,
      duration:1.2, ease:'cinematic',
      delay:.3,
      onComplete:()=>{ document.getElementById('loader').style.display='none'; initAll(); }
    });
  }, 1400);
});

// ── NAVBAR ───────────────────────────────────────────────
ScrollTrigger.create({
  start:100,
  onEnter:   ()=>document.getElementById('navbar').classList.add('scrolled'),
  onLeaveBack:()=>document.getElementById('navbar').classList.remove('scrolled'),
});

// ── PARTICLES ────────────────────────────────────────────
function createParticles(){
  const container = document.getElementById('particles');
  for(let i=0;i<40;i++){
    const p = document.createElement('div');
    p.className='particle';
    p.style.left  = Math.random()*100+'%';
    p.style.top   = Math.random()*100+'%';
    container.appendChild(p);
    gsap.to(p,{
      opacity:Math.random()*.4+.1,
      x:(Math.random()-0.5)*80,
      y:(Math.random()-0.5)*80,
      duration:Math.random()*6+4,
      repeat:-1, yoyo:true, ease:'sine.inOut',
      delay:Math.random()*4
    });
  }
}

// ── HERO ANIMATION ───────────────────────────────────────
function animateHero(){
  const tl = gsap.timeline({ delay:.1 });
  tl.to('.hero-eyebrow',{ opacity:1, y:0, duration:1, ease:'cinematic' })
    .to('.word',{
      y:0, duration:1.2, ease:'cinematic', stagger:.1
    },'-=.5')
    .to('.hero-sub',{ opacity:1, y:0, duration:1, ease:'cinematic' },'-=.5')
    .to('.hero-actions',{ opacity:1, y:0, duration:1, ease:'cinematic' },'-=.5')
    .to('.scroll-hint',{ opacity:1, duration:1 },'-=.3');
}

// ── PARALLAX HERO ORBS on scroll ─────────────────────────
function initParallaxOrbs(){
  gsap.to('#orb1',{
    yPercent:-30,
    ease:'none',
    scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true }
  });
  gsap.to('#orb2',{
    yPercent:-50,
    ease:'none',
    scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true }
  });
  gsap.to('#orb3',{
    yPercent:-20, xPercent:10,
    ease:'none',
    scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true }
  });
}

// ── INGREDIENT CARDS PARALLAX ─────────────────────────────
function initIngredientParallax(){
  const cards = document.querySelectorAll('.ing-card');
  const depths = [0.3, 0.5, 0.2, 0.4, 0.35];
  cards.forEach((c,i)=>{
    gsap.fromTo(c,
      { opacity:0, scale:.85, rotation: (i%2===0?-4:4) },
      {
        opacity:1, scale:1, rotation:0,
        duration:1, ease:'bounce',
        scrollTrigger:{ trigger:'#philosophy', start:'top 80%', toggleActions:'play none none reverse' },
        delay: i*.12
      }
    );
    gsap.to(c,{
      yPercent: depths[i]*-60,
      ease:'none',
      scrollTrigger:{ trigger:'#philosophy', start:'top bottom', end:'bottom top', scrub:true }
    });
  });
}

// ── FEATURES REVEAL ──────────────────────────────────────
function initFeatures(){
  gsap.fromTo('.feature-item',
    { opacity:0, y:60 },
    {
      opacity:1, y:0, duration:1, ease:'cinematic', stagger:.15,
      scrollTrigger:{ trigger:'#features', start:'top 75%', toggleActions:'play none none reverse' }
    }
  );
}

// ── EXPANDING GALLERY CARDS ───────────────────────────────
function initGallery(){
  const cards = document.querySelectorAll('.gallery-card');
  // GSAP scroll reveal of whole gallery
  gsap.fromTo('#galleryTrack',
    { opacity:0, y:60 },
    { opacity:1, y:0, duration:1.2, ease:'cinematic',
      scrollTrigger:{ trigger:'#gallery', start:'top 75%' } }
  );
  cards.forEach((card,i)=>{
    card.addEventListener('mouseenter',()=>{
      cards.forEach(c=>{
        c.classList.remove('active');
        gsap.to(c.querySelector('.gallery-card-bg'),{ scale:1.1, filter:'brightness(.4)', duration:.8, ease:'cinematic' });
      });
      card.classList.add('active');
      gsap.to(card.querySelector('.gallery-card-bg'),{ scale:1, filter:'brightness(.6)', duration:.8, ease:'cinematic' });
      gsap.fromTo(card.querySelector('.gallery-card-content'),
        { y:20, opacity:0 },
        { y:0, opacity:1, duration:.6, ease:'bounce', delay:.15 }
      );
    });
  });
}

// ── STATS COUNTER ─────────────────────────────────────────
function initStats(){
  document.querySelectorAll('.stat-number').forEach(el=>{
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    ScrollTrigger.create({
      trigger: el,
      start:'top 85%',
      once:true,
      onEnter:()=>{
        gsap.fromTo({v:0},{v:target},{
          v:target, duration:2, ease:'power2.out',
          onUpdate:function(){ el.textContent = Math.round(this.targets()[0].v)+suffix; }
        });
      }
    });
  });
  gsap.fromTo('.stat-item',
    { opacity:0, y:40 },
    { opacity:1, y:0, duration:1, stagger:.15, ease:'cinematic',
      scrollTrigger:{ trigger:'#stats', start:'top 80%' } }
  );
}

// ── HORIZONTAL SCROLL ─────────────────────────────────────
function initHorizontalScroll(){
  const track  = document.getElementById('horizTrack');
  const panels = document.querySelectorAll('.horiz-panel');
  const dots   = document.querySelectorAll('.prog-dot');

  // Calculate total width to scroll
  const totalWidth = (panels.length - 1) * window.innerWidth;

  gsap.to(track,{
    x: -totalWidth,
    ease:'none',
    scrollTrigger:{
      trigger:'#horizOuter',
      start:'top top',
      end:`+=${totalWidth}`,
      scrub:1,
      pin:true,
      anticipatePin:1,
      onUpdate: self=>{
        const step = Math.round(self.progress * (panels.length-1));
        dots.forEach((d,i)=>d.classList.toggle('active',i===step));
      }
    }
  });

  // Panel content reveal on enter
  panels.forEach((panel,i)=>{
    gsap.fromTo(panel.querySelector('.horiz-panel-inner'),
      { opacity:0, x:40 },
      {
        opacity:1, x:0, duration:1, ease:'cinematic',
        scrollTrigger:{
          trigger:'#horizOuter',
          start:`${i * 25}% top`,
          end:`${i * 25 + 10}% top`,
          scrub:.5,
          containerAnimation: gsap.to(track,{x:-totalWidth,ease:'none'}) // will be re-triggered
        }
      }
    );
  });
}

// ── TIERS REVEAL ─────────────────────────────────────────
function initTiers(){
  gsap.fromTo('.tier-card',
    { opacity:0, y:60, scale:.96 },
    {
      opacity:1, y:0, scale:1, duration:1.1, ease:'bounce', stagger:.15,
      scrollTrigger:{ trigger:'#tiers', start:'top 75%' }
    }
  );
}

// ── CTA REVEAL ───────────────────────────────────────────
function initCTA(){
  gsap.fromTo('.cta-h2',
    { opacity:0, y:50 },
    { opacity:1, y:0, duration:1.3, ease:'cinematic',
      scrollTrigger:{ trigger:'#cta', start:'top 75%' } }
  );
}

// ── GENERAL REVEALS ──────────────────────────────────────
function initReveal(){
  gsap.utils.toArray('.reveal').forEach(el=>{
    gsap.fromTo(el,
      { opacity:0, y:50 },
      { opacity:1, y:0, duration:1.1, ease:'cinematic',
        scrollTrigger:{ trigger:el, start:'top 82%', toggleActions:'play none none reverse' } }
    );
  });
}

// ── PHILOSOPHY TEXT REVEAL ────────────────────────────────
function initPhilosophy(){
  gsap.fromTo('.philosophy-h2',
    { opacity:0, y:40 },
    { opacity:1, y:0, duration:1.2, ease:'cinematic',
      scrollTrigger:{ trigger:'#philosophy', start:'top 75%' } }
  );
  gsap.fromTo('.philosophy-p',
    { opacity:0 },
    { opacity:1, duration:1.2, ease:'cinematic', delay:.3,
      scrollTrigger:{ trigger:'#philosophy', start:'top 70%' } }
  );
}

// ── MARQUEE SPEED ON SCROLL ───────────────────────────────
function initMarquee(){
  let speed = 1;
  ScrollTrigger.create({
    trigger: 'body',
    start:'top top',
    end:'bottom bottom',
    onUpdate: self=>{
      speed = 1 + self.getVelocity()/3000;
      gsap.to('.marquee-track',{ timeScale: Math.min(Math.abs(speed),4), duration:.5 });
    }
  });
}

// ── MAIN INIT ─────────────────────────────────────────────
function initAll(){
  createParticles();
  animateHero();
  initParallaxOrbs();
  initIngredientParallax();
  initFeatures();
  initGallery();
  initStats();
  initHorizontalScroll();
  initTiers();
  initCTA();
  initReveal();
  initPhilosophy();
  initMarquee();
}

// Handle resize
let resizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(()=>ScrollTrigger.refresh(),200);
});
</script>
</body>
</html>
