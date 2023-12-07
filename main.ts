namespace SpriteKind {
    export const chimney = SpriteKind.create()
}

//  sprites
let santa = sprites.create(assets.image`santa`, SpriteKind.Player)
santa.setFlag(SpriteFlag.BounceOnWall, true)
santa.scale = 1.5
santa.x = 30
santa.z = 5
santa.startEffect(effects.trail)
//  variables
let speed_up = 3
let slow_down = 0.99
let presents_to_deliver = 30
//  setup
info.setLife(3)
effects.blizzard.startScreenEffect()
info.startCountdown(120)
//  backgrounds
scroller.setLayerImage(0, assets.image`background`)
scroller.setLayerImage(1, assets.image`houses back`)
scroller.setLayerImage(2, assets.image`houses`)
scroller.scrollBackgroundWithSpeed(-15, 0, 0)
scroller.scrollBackgroundWithSpeed(-30, 0, 1)
scroller.scrollBackgroundWithSpeed(-35, 0, 2)
//  text
let present_text = textsprite.create("" + presents_to_deliver, 1, 3)
present_text.scale = 1
present_text.right = 160
present_text.bottom = 120
present_text.z = 10
controller.A.onEvent(ControllerButtonEvent.Pressed, function drop_present() {
    let present: Sprite;
    // 
    if (sprites.allOfKind(SpriteKind.Projectile).length < 1) {
        present = sprites.create(assets.image`present`, SpriteKind.Projectile)
        present.setPosition(santa.x - 5, santa.y + 5)
        present.vy = santa.vy
        present.setFlag(SpriteFlag.AutoDestroy, true)
    }
    
})
function spawn_chimney() {
    let chimney = sprites.create(assets.image`chimney`, SpriteKind.chimney)
    chimney.left = 159
    chimney.bottom = 120
    chimney.vx = -40
    timer.after(randint(1000, 3000), spawn_chimney)
}

timer.after(randint(1000, 3000), spawn_chimney)
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function hit_bird(santa: Sprite, bird: Sprite) {
    info.changeLifeBy(-1)
    bird.destroy()
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.chimney, function present_lands(present: Sprite, chimney: Sprite) {
    //  
    
    // 
    presents_to_deliver -= 1
    //  
    present_text.setText("" + presents_to_deliver)
    //  
    if (presents_to_deliver < 1) {
        // 
        game.over(true)
    }
    
    // 
    info.changeScoreBy(1000)
    present.destroy()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.chimney, function hit_chimney(santa: Sprite, chimney: Sprite) {
    //  
    info.changeLifeBy(-1)
    santa.vy = -40
})
sprites.onDestroyed(SpriteKind.Projectile, function present_destroyed(present: Sprite) {
    // 
    if (present.top > 120) {
        info.changeScoreBy(-1500)
    }
    
})
game.onUpdateInterval(1500, function spawn_bird() {
    let bird = sprites.create(assets.image`bird`, SpriteKind.Enemy)
    animation.runImageAnimation(bird, assets.animation`bird anim`, 75, true)
    bird.left = 159
    bird.y = randint(10, 110)
    bird.vx = -75
})
function presents_fall() {
    //  
    for (let present of sprites.allOfKind(SpriteKind.Projectile)) {
        present.vy += 3
    }
}

function move() {
    if (controller.up.isPressed()) {
        santa.vy -= speed_up
    } else if (controller.down.isPressed()) {
        santa.vy += speed_up
    }
    
    santa.vy *= slow_down
}

game.onUpdate(function tick() {
    presents_fall()
    //  
    move()
    info.changeScoreBy(1)
})
