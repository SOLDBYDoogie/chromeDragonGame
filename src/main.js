let $canvas = document.getElementById('canvas');
let $h1 = document.querySelector('h1');
let ctx = $canvas.getContext('2d');

// 드래그 방지
document.onselectstart= () => {return false};
// space바로 page down 방지 (keyborad 입력 금지)
// document.onkeydown= () => {return false};

$canvas.width = 1150;
$canvas.height = 700;
$canvas.style.display = 'flex';
$canvas.style.margin = 'auto';

let defeat = {
    x : 100,
    y : 800,
    width : 1000,
    height : 500,

    draw() {
        ctx.font = "200px serif";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText("DEFEAT", $canvas.width/2, $canvas.height/2);

        ctx.font = "40px serif"
        ctx.fillText("press w, up, space", $canvas.width/2, $canvas.height/2 +70);
        $score.scoreWidth = $canvas.width/2
        
        ctx.fillStyle = "#999999";
        ctx.globalAlpha = 0.3;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
    }
}

let $score = {
    scoreWidth : 1000,
    scoreHeight : 100,
    draw() {
        if(window.innerWidth < 1200){
            this.scoreWidth = window.innerWidth - 200;
        }
        ctx.font = "20px gothic";
        ctx.fillStyle = "#000000";
        ctx.fillText("HighScore : "+ highScore, this.scoreWidth, this.scoreHeight);
        ctx.fillText("score : "+ score, this.scoreWidth, this.scoreHeight+20);
        
    }
}

let line = {
    draw(){
        ctx.moveTo(-20,450);
        ctx.lineTo(2000,450);
        ctx.lineWidth = 4;
        ctx.stroke();
    }
}

let meImg = new Image();

let me = {
    x : 40,
    y : 400,
    width : 50,
    height : 50,
    i : 0,
    j : 0,
    ImgArray : [
        "/Users/hurray/Desktop/프로젝트/word game/src/happycatapple-1.png",
        "/Users/hurray/Desktop/프로젝트/word game/src/happycatapple-2.png",
        "/Users/hurray/Desktop/프로젝트/word game/src/happycatapple-3.png",
        "/Users/hurray/Desktop/프로젝트/word game/src/happycatapple-4.png",
        "/Users/hurray/Desktop/프로젝트/word game/src/happycatapple-5.png",
        "/Users/hurray/Desktop/프로젝트/word game/src/happycatapple-6.png",
        "/Users/hurray/Desktop/프로젝트/word game/src/happycatapple-7.png",
        "/Users/hurray/Desktop/프로젝트/word game/src/happycatapple-8.png"
    
    ],

    draw(){
        // ctx.fillStyle = 'rgb(0,200,0)';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        
        meImg.src = this.ImgArray[this.i];
        this.j++;
        if(this.j === 8){
            this.i++;
            this.j = 0;
        }
        if(this.i === 8 ) this.i = 0;
        ctx.drawImage(meImg, this.x-10, this.y-10, this.width+20, this.height+20);
    }
}

let jumpNow = false;
let jumping = false;
let standing = false;
let jumpTimer = 0;
let jumpSpeed = 3;
// 나의 점프

//
let jumpKey = ['Space', 'ArrowUp', 'KeyW'];
let standKey = ['ArrowDown', 'KeyS']
let resetKey = ['KeyR']
let reset = 0;
document.addEventListener("keydown", (e) => {
    if(jumpKey.includes(e.code)){
        if(jumpNow === false){
            jumping = true;
            standing = false;
        } 

        if(game == false){
            game = true;
            location.reload();
        }
    }
    
    else if(standKey.includes(e.code)){
        standing = true;
     
    }

    // 점수 초기화
    if(game == false && resetKey.includes(e.code)){
        console.log(e.code)
        reset ++;
            if(reset === 5){
                localStorage.setItem('highScore', 0);
                reset = 0;  
                location.reload();
            }
        }
    }
) 


let enemyImg = new Image();
enemyImg.src = "/Users/hurray/Desktop/프로젝트/word game/src/고양잉.webp";
class Enemy {
    constructor(){
        this.x = 1600;
        this.y = 400;
        this.width = 50;
        this.height = 50;
    }
    draw(){
        // ctx.fillStyle = 'rgb(200,0,0)';
        // ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.glovalCompositeOperation = 'source-over';
        ctx.drawImage(enemyImg, this.x-20, this.y -30, this.width+30, this.height+30);
    }
}

let score = 0;
if(localStorage.getItem('highScore') === null){
    localStorage.setItem('highScore', 0);
}
let highScore = localStorage.getItem('highScore');

let game = true;
let timer = 0;
let enemies = [];

// 빈도 수
const hard = 140;
const normal = 240;
const difficulty = [hard, normal];
const choice = 0;

// 속도


// 충돌 여부
function isCrush(me, enemy){
    let xDif;
    let yDif = enemy.y - (me.y + me.height);
    
    if(enemy.x > 40){
        xDif = enemy.x - (me.x + me.width);
    }
    
    else{
        xDif = me.x - (enemy.x + enemy.width);
    }
    
    
    if(xDif < 0 && yDif <0){
        cancelAnimationFrame(animation);
        ctx.clearRect(0,0, $canvas.width, $canvas.height);

        game = false;
        defeat.draw();
        // $h1.style.position = 'position:relative';
        // $h1.style.display = 'block';

        
        //최고기록 갱신
        if(score > highScore){
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }  
    }
}

function excuteEveryFrame(){
    animation = requestAnimationFrame(excuteEveryFrame);
    timer++;
    score++;
    
    ctx.clearRect(0,0, $canvas.width, $canvas.height);

    // 적 생성
    if(timer % difficulty[1] == 0){
        let enemy = new Enemy();
        enemies.push(enemy);
    }

    // 적 소환 및 제거
    enemies.forEach((e, i, o) =>{
        if(e.x < -40) {
            o.splice(i, 1);
        }

        isCrush(me, e);

        e.draw();
        e.x -= 3;
    })

    if(jumping === true && jumpNow === false){
        me.y-= (jumpSpeed);
        jumpTimer++;
        
    }

    if(jumpTimer > 40 || standing == true){
        jumping = false;
        jumpTimer = 0;
        jumpNow = true;
    }

    if(jumping === false){
        if(me.y <= 400){
            me.y+= (jumpSpeed+0.3);

            if(standing === true){
                me.y += (jumpSpeed + 1);
            }
            // 오차 방지 및 중복 점프 방지
            if(me.y > 398){ 
                me.y = 400;
                jumpNow = false;
            }
        }
    
    }


    // 선, 자신 생성
    me.draw();
    line.draw();
    $score.draw();

    // 최고기록 실시간 갱신
    if(score > highScore){
        $score.draw();
    }

}

excuteEveryFrame();
