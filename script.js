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
    // initAwardsCarousel(); // 暂时禁用，HTML中没有轮播结构
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
    const copyButtons = document.querySelectorAll('.btn-copy');

    copyButtons.forEach(copyButton => {
        copyButton.addEventListener('click', function() {
            const targetId = this.getAttribute('data-clipboard-target');
            if (!targetId) return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            const text = targetElement.textContent;

            // 使用Clipboard API
            navigator.clipboard.writeText(text).then(() => {
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
    });
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

// 奖项旋转木马
function initAwardsCarousel() {
    const carousel = document.querySelector('.awards-carousel');
    const items = document.querySelectorAll('.award-item');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const dotsContainer = document.querySelector('.carousel-dots');

    console.log('初始化奖项轮播:', {
        carousel: !!carousel,
        itemsCount: items.length,
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn,
        dotsContainer: !!dotsContainer
    });

    if (!carousel || items.length === 0) {
        console.warn('奖项轮播初始化失败：缺少必要元素');
        return;
    }

    let currentIndex = 0;
    const totalItems = items.length;
    let dragOffset = 0; // 水平拖动的偏移量（像素）

    // 动态计算项目宽度和间距
    function getItemWidth() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) {
            return 320; // 桌面端
        } else if (screenWidth >= 768) {
            return 280; // 平板
        } else {
            return 250; // 手机
        }
    }

    function getGap() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1024) {
            return 40; // 桌面端
        } else if (screenWidth >= 768) {
            return 30; // 平板
        } else {
            return 20; // 手机
        }
    }

    // 计算容器总宽度
    function getCarouselWidth() {
        const itemWidth = getItemWidth();
        const gap = getGap();
        return totalItems * (itemWidth + gap) - gap;
    }

    // 创建指示点
    items.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `查看奖项 ${index + 1}`);
        dot.addEventListener('click', () => {
            console.log(`点击圆点 ${index}`);
            slideTo(index);
        });
        dotsContainer.appendChild(dot);
        console.log(`创建圆点 ${index}`);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    // 初始化位置
    updateCarousel();

    // 上一张/下一张按钮事件
    prevBtn.addEventListener('click', () => {
        console.log('点击上一个按钮');
        slideTo(currentIndex - 1);
    });
    nextBtn.addEventListener('click', () => {
        console.log('点击下一个按钮');
        slideTo(currentIndex + 1);
    });

    // 鼠标拖动支持
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        currentX = startX;
        carousel.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
        const delta = currentX - startX;
        // 直接使用像素偏移
        dragOffset = delta;
        updateCarouselDrag();
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.transition = 'transform var(--transition-normal)';

        // 计算最近的索引
        const itemWidth = getItemWidth();
        const threshold = itemWidth / 3; // 拖动超过项目宽度的1/3才切换

        if (dragOffset > threshold) {
            // 向右拖动，切换到上一个项目（因为拖动方向与滑动方向相反）
            slideTo(currentIndex - 1);
        } else if (dragOffset < -threshold) {
            // 向左拖动，切换到下一个项目
            slideTo(currentIndex + 1);
        } else {
            // 拖动距离不够，回弹到当前项目
            updateCarousel();
        }
    });

    // 触摸屏支持
    carousel.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        currentX = startX;
        carousel.style.transition = 'none';
    });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const delta = currentX - startX;
        dragOffset = delta;
        updateCarouselDrag();
    });

    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        carousel.style.transition = 'transform var(--transition-normal)';

        // 计算最近的索引
        const itemWidth = getItemWidth();
        const threshold = itemWidth / 3; // 拖动超过项目宽度的1/3才切换

        if (dragOffset > threshold) {
            // 向右拖动，切换到上一个项目（因为拖动方向与滑动方向相反）
            slideTo(currentIndex - 1);
        } else if (dragOffset < -threshold) {
            // 向左拖动，切换到下一个项目
            slideTo(currentIndex + 1);
        } else {
            // 拖动距离不够，回弹到当前项目
            updateCarousel();
        }
    });

    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            slideTo(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            slideTo(currentIndex + 1);
        }
    });

    function slideTo(index) {
        // 处理循环
        const newIndex = ((index % totalItems) + totalItems) % totalItems;
        console.log(`滑动到索引: ${index} -> ${newIndex} (当前: ${currentIndex})`);
        currentIndex = newIndex;
        updateCarousel();
    }

    function updateCarousel() {
        const itemWidth = getItemWidth();
        const gap = getGap();
        const containerWidth = document.querySelector('.awards-carousel-container').offsetWidth;

        // 设置容器间距
        carousel.style.gap = `${gap}px`;

        // 计算使当前项目居中的偏移量
        // 公式：偏移量 = -(currentIndex * (itemWidth + gap)) + (containerWidth/2) - (itemWidth/2)
        const offset = -(currentIndex * (itemWidth + gap)) + (containerWidth / 2) - (itemWidth / 2) + dragOffset;

        // 应用偏移到轮播容器
        carousel.style.transform = `translateX(${offset}px)`;

        // 更新项目状态
        items.forEach((item, index) => {
            const itemOffset = ((index - currentIndex + totalItems) % totalItems);
            item.classList.toggle('active', itemOffset === 0);

            // 根据活动状态调整样式
            if (itemOffset === 0) {
                // 当前活动项
                item.style.zIndex = 20;
                item.style.opacity = 1;
                item.style.transform = 'scale(1.15)';
            } else {
                // 非活动项
                item.style.zIndex = 1;
                item.style.opacity = 0.7;
                item.style.transform = 'scale(0.9)';
            }
        });

        // 更新指示点
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // 重置拖动偏移
        dragOffset = 0;
    }

    function updateCarouselDrag() {
        const itemWidth = getItemWidth();
        const gap = getGap();
        const containerWidth = document.querySelector('.awards-carousel-container').offsetWidth;

        // 设置容器间距
        carousel.style.gap = `${gap}px`;

        // 计算拖动时的偏移量
        const offset = -(currentIndex * (itemWidth + gap)) + (containerWidth / 2) - (itemWidth / 2) + dragOffset;

        // 应用偏移到轮播容器
        carousel.style.transform = `translateX(${offset}px)`;
    }

    // 自动轮播（可选）
    let autoRotateInterval;
    function startAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(() => {
            slideTo(currentIndex + 1);
        }, 5000);
    }

    function stopAutoRotate() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
    }

    // 当鼠标悬停在轮播区域时停止自动轮播
    const carouselContainer = document.querySelector('.awards-carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoRotate);
    carouselContainer.addEventListener('mouseleave', startAutoRotate);

    // 窗口大小改变时更新布局
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // 开始自动轮播
    startAutoRotate();
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