import React from 'react';
import './Main.css';
import NavBar from '../NavBar/NavBar';
import heroBg from './photos/school-backpack-world-globe.jpg';
import shabratPhoto from './photos/photo_2024-08-27_13-28-26.jpg';
function Main() {
    return (
        <div className="main-container">
            {/* Навигационная панель */}
            <NavBar />

            {/* 1) Hero Section */}
            <section
                className="hero-section"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                <div className="hero-content">
                    <h1 className="hero-title"> Ласкаво просимо до Grammar, вашого нового помічника у володінні
                        англійською мовою!</h1>
                    <p className="hero-subtitle">
                        Ми з радістю представляємо вам веб-додаток, розроблений як
                        кваліфікаційний проект двох студентів. Нашою метою було створити
                        зручний та ефективний інструмент, який може слугувати надійним
                        помічником у вивченні англійської мови.
                    </p>
                    <div className="hero-buttons">
                        <button className="hero-btn start-journey">Start a Journey</button>
                        <button className="hero-btn get-template">Get Template Now</button>
                    </div>
                </div>
            </section>

            {/* 2) Статистические блоки (Stats Section) */}
            <section className="stats-section">
                <div className="stats-item">
                    <h2>15+</h2>
                    <p>Interactive Features</p>
                </div>
                <div className="stats-item">
                    <h2>4+</h2>
                    <p>Supported Difficulty Levels</p>
                </div>
                <div className="stats-item">
                    <h2>24/7</h2>
                    <p>Learning Access</p>
                </div>
                <div className="stats-item">
                    <h2>AI Support</h2>
                    <p>Smart Dialogues</p>
                </div>
            </section>

            {/* 3) Раздел с особенностями (Features Section) */}
            <section className="features-section">
                <h2 className="section-title">Discover the Features That Elevate Your Learning</h2>
                <p className="section-subtitle">
                    Our platform is designed to offer a wide range of tools and functionalities that make learning engaging, effective, and accessible. From AI-powered personalization to real-time feedback, each feature has been carefully crafted to support your language journey. Explore what makes our platform your ultimate partner in mastering English.
                </p>
                <div className="features-grid">
                    <div className="feature-box">
                        <div className="feature-icon">&#128214;</div>
                        <h3>Rich Vocabulary Resources</h3>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">&#128187;</div>
                        <h3>Interactive Dialogues</h3>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">&#128640;</div>
                        <h3>AI-Powered Learning</h3>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">&#128188;</div>
                        <h3>Customizable Tests</h3>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">&#128270;</div>
                        <h3>Cloud-Based Access</h3>
                    </div>
                    <div className="feature-box">
                        <div className="feature-icon">&#128187;</div>
                        <h3>Gamified Experience</h3>
                    </div>
                    {/* Добавьте при необходимости ещё блоки */}
                </div>
            </section>

            {/* 4) Призыв к действию / поддержка (CTA Section) */}
            <section className="cta-section">
                <h2 className="cta-title">Dedicated 24/7 Support</h2>
                <p className="cta-subtitle">
                    Our Support Service is always available 24 hours a day, 7 days a week
                    to help you.
                </p>
            </section>

            {/* 5) Ваш «Grammarzone» блок: оригинальный текст */}
            <section className="grammarzone-section">
                <h2>Grammar!</h2>
                <p>
                    У сучасному світі володіння англійською мовою має велике значення.
                    Воно відчиняє двері до нових можливостей, полегшує комунікацію та
                    допомагає подолати виклики як у особистому, так і у професійному
                    житті. Ми розуміємо важливість розвитку мовних навичок і прагнемо
                    надати користувачам легкий та ефективний шлях до покращення.
                </p>
                <p>
                    Grammarzone пропонує широкий спектр ресурсів та вправ, створених з
                    фокусом на основних аспектах граматики англійської мови. Тут ви
                    знайдете навчальні матеріали, що підтримують ваш шлях навчання, а
                    також тести, що закріплюють ваші знання та відстежують ваш прогрес. Ми
                    сподіваємося, що Grammarzone стане вашим надійним партнером у вивченні
                    англійської мови. Незалежно від того, чи ви студент, викладач чи
                    просто ентузіаст англійської мови, наш додаток надасть вам цінні
                    інструменти для успішної освіти.
                </p>
            </section>
            {/* Секция "Розробник" */}
            <section className="developer-section">
                <div className="developer-header">
                    <h2>Розробник</h2>
                </div>
                <div className="developer-content">
                    <img src={shabratPhoto} alt="Алексій Шабрат" className="developer-photo" />
                    <p className="developer-name">Олексій Шабрат</p>
                </div>
            </section>
        </div>
    );
}

export default Main;
