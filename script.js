// 移动端检测
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.innerWidth <= 768);
}

// 性能优化：延迟加载非关键资源
function lazyLoadResources() {
    // 延迟加载Font Awesome（如果可用）
    if (isMobileDevice()) {
        // 移动端延迟加载外部资源
        const loadFontAwesome = function() {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(link);
        };

        // 延迟1秒加载，让关键内容先显示
        setTimeout(loadFontAwesome, 1000);
    }
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 延迟加载非关键资源
    lazyLoadResources();
    // 初始化功能
    initSmoothScroll();
    initMobileMenu();
    initScrollAnimations();
    initEmailProtection();
    initBackToTop();
    initCurrentYear();
    initCopyButton();
    initAvatarUpload();
});

// 平滑滚动
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // 关闭移动端菜单（如果打开）
                const navLinksContainer = document.querySelector('.nav-links');
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    document.querySelector('.menu-toggle i').classList.replace('fa-times', 'fa-bars');
                }

                // 平滑滚动到目标位置
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 移动端菜单切换
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');

            const icon = this.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // 点击菜单外区域关闭菜单
        document.addEventListener('click', function(e) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
        });
    }
}

// 滚动动画
function initScrollAnimations() {
    // 时间线项目动画
    const timelineItems = document.querySelectorAll('.timeline-item');

    // 技能标签浮动动画
    const skillTags = document.querySelectorAll('.skill-tag');

    // 返回顶部按钮显示/隐藏
    const backToTopBtn = document.querySelector('.back-to-top');

    // 使用Intersection Observer API
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // 如果是时间线项目，添加延迟动画
                if (entry.target.classList.contains('timeline-item')) {
                    const index = Array.from(timelineItems).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // 观察时间线项目
    timelineItems.forEach(item => {
        observer.observe(item);
    });

    // 滚动事件处理
    window.addEventListener('scroll', function() {
        // 返回顶部按钮显示/隐藏
        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // 导航栏背景变化
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }
    });
}

// 邮箱防爬虫保护
function initEmailProtection() {
    const emailElement = document.getElementById('email-text');

    if (emailElement) {
        // 使用简单的编码来防止爬虫
        const emailParts = ['17854221221', '163', 'com'];
        const email = `${emailParts[0]}@${emailParts[1]}.${emailParts[2]}`;

        // 延迟显示，增加爬虫难度
        setTimeout(() => {
            emailElement.textContent = email;
            emailElement.style.opacity = '1';
        }, 1000);
    }
}

// 返回顶部功能
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 设置当前年份
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');

    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = currentYear;
    }
}

// 复制按钮功能
function initCopyButton() {
    const copyButton = document.querySelector('.btn-copy');

    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const emailElement = document.getElementById('email-text');
            const email = emailElement.textContent;

            // 使用Clipboard API
            navigator.clipboard.writeText(email).then(() => {
                // 显示成功反馈
                const originalText = copyButton.textContent;
                copyButton.textContent = '已复制!';
                copyButton.style.background = 'rgba(46, 204, 113, 0.3)';

                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                copyButton.textContent = '复制失败';
                copyButton.style.background = 'rgba(231, 76, 60, 0.3)';

                setTimeout(() => {
                    copyButton.textContent = '复制';
                    copyButton.style.background = '';
                }, 2000);
            });
        });
    }
}

// 头像上传模拟
function initAvatarUpload() {
    const avatarContainer = document.querySelector('.avatar-container');
    const avatarImg = document.getElementById('avatar-img');

    if (avatarContainer && avatarImg) {
        avatarContainer.addEventListener('click', function() {
            // 模拟文件选择
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';

            fileInput.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();

                    reader.onload = function(event) {
                        avatarImg.src = event.target.result;

                        // 显示成功消息
                        const overlay = avatarContainer.querySelector('.avatar-overlay');
                        if (overlay) {
                            const icon = overlay.querySelector('i');
                            const text = overlay.querySelector('span');

                            icon.classList.replace('fa-camera', 'fa-check');
                            text.textContent = '上传成功!';

                            setTimeout(() => {
                                icon.classList.replace('fa-check', 'fa-camera');
                                text.textContent = '上传照片';
                            }, 2000);
                        }
                    };

                    reader.readAsDataURL(file);
                }
            };

            fileInput.click();
        });
    }
}

// 页面加载动画
window.addEventListener('load', function() {
    // 添加加载完成类
    document.body.classList.add('loaded');

    // 隐藏加载指示器（如果有的话）
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        setTimeout(() => {
            scrollIndicator.style.opacity = '1';
        }, 500);
    }
});

// 键盘导航支持
document.addEventListener('keydown', function(e) {
    // ESC键关闭移动菜单
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const menuToggleIcon = document.querySelector('.menu-toggle i');
            if (menuToggleIcon) {
                menuToggleIcon.classList.replace('fa-times', 'fa-bars');
            }
        }
    }

    // Tab键导航增强
    if (e.key === 'Tab') {
        // 确保焦点在页面内
        const focusableElements = document.querySelectorAll(
            'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            // Shift+Tab在第一个元素上，跳转到最后一个元素
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            // Tab在最后一个元素上，跳转到第一个元素
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// 性能优化：懒加载图片
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    // 观察所有懒加载图片
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// 错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
    // 可以在这里添加错误上报逻辑
});

// 离线支持
window.addEventListener('online', function() {
    console.log('网络已连接');
});

window.addEventListener('offline', function() {
    console.log('网络已断开');
});