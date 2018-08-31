export default {
    name: 'pointLineFactory',
    fn: [function () {
        return function (p5) {

            let particles = [];
            let total = 30; // 粒子总数
            let z = 2; // 控制分散程度
            let s = 2; // 粒子大小比例
            // let dz = 0; // 分散程度变化速度
            // let ddz = 0; // 分散程度变化加速度
            let threshold = 200; // 连线作用范围
            // let expanded = true; // 是否处于扩散状态
            // let Fibonacci = [1, 2, 3, 5, 8, 13];
            let Fibonacci = [1, 2, 3, 4, 5, 6];
            let canvasL = window.innerHeight * 0.56;

            // 粒子 object
            function Particle() {
                // 在宽和高方向正态分布
                this.sxd = 0;
                this.syd = 0;
                this.a = parseInt(p5.randomGaussian(0, 1) * 10, 0) * p5.width * 8 / 1000;
                this.b = parseInt(p5.randomGaussian(0, 1) * 10, 0) * p5.height * 6 / 1000;
                this.link = 0;
                this.ra = p5.random(1);

                this.range = p5.random(30); // 粒子的运动范围
                this.angle = p5.random(2 * p5.PI); // 粒子圆形运动轨迹的起始角度
                this.da = p5.random(-0.03, 0.03); // 角度变化速度

                // 随机设置圆的大小
                let r = 2;

                function randomR() {
                    r = parseInt(p5.randomGaussian(0, 1) * 10, 0);
                    if (r < 2 || r > 5) {
                        randomR();
                    }
                }
                randomR();

                this.r = p5.random(r, r); // 粒子半径
                this.alpha = p5.random(255, 255); // 粒子透明度
                this.update = function () {
                    this.angle += this.da;
                    // 按照圆形轨迹运动
                    this.x = this.a * z + p5.cos(this.angle) * this.range;
                    this.y = this.b * z + p5.sin(this.angle) * this.range;
                };

                this.show = function () {

                    if (this.ra < 0.3) {
                        p5.fill(255, this.alpha);
                    } else if (this.ra < 0.6) {
                        p5.fill(251, 233, 80, this.alpha);
                    } else {
                        p5.fill(247, 131, 15, this.alpha);
                    }
                    p5.noStroke();
                    p5.ellipse(this.x, this.y, this.r * s, this.r * s);
                };
            }

            p5.setup = function () {
                p5.createCanvas(canvasL, canvasL);
                for (let i = 0; i < total; i++) {
                    particles[i] = new Particle();
                }
                p5.background('#00bc8d');
            };


            function backgroundCircle() {
                let sum = 0;

                for (let i = 0; i < Fibonacci.length; i++) {
                    sum += Fibonacci[i];
                }
                for (let i = 0; i < Fibonacci.length; i++) {
                    p5.fill(255, 20);
                    p5.noStroke();
                    p5.ellipse(0, 0, Fibonacci[i] / sum * p5.width * 3.5, Fibonacci[i] / sum * p5.width * 3.5);
                }
            }

            p5.draw = function () {
                p5.translate(p5.width / 2, p5.height / 2);
                p5.background('#00bc8d');
                backgroundCircle();
                p5.strokeWeight(1);

                for (let i = 0; i < particles.length; i++) {
                    for (let j = 0; j < particles.length; j++) {
                        if (i !== j) {
                            let dists = p5.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);

                            if (dists < threshold && particles[i].link < 5 && particles[j].link < 5) {
                                particles[i].link += 2;
                                particles[j].link += 2;
                                p5.stroke(255, 150);
                                p5.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                            }
                        }
                    }
                }

                for (let i = 0; i < particles.length; i++) {
                    particles[i].update();
                    particles[i].show();
                    particles[i].link = 0;
                }

            };

        };

    }]
};
