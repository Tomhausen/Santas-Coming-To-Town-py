@namespace 
class SpriteKind:
    chimney = SpriteKind.create()

# sprites
santa = sprites.create(assets.image("santa"), SpriteKind.player)
santa.set_flag(SpriteFlag.BOUNCE_ON_WALL, True)
santa.scale = 1.5
santa.x = 30
santa.z = 5
santa.start_effect(effects.trail)

# variables
speed_up = 3
slow_down = 0.99
presents_to_deliver = 30 # 

# setup
info.set_life(3)
effects.blizzard.start_screen_effect()
info.start_countdown(120) # 

# backgrounds
scroller.set_layer_image(0, assets.image("background"))
scroller.set_layer_image(1, assets.image("houses back"))
scroller.set_layer_image(2, assets.image("houses"))
scroller.scroll_background_with_speed(-15, 0, 0)
scroller.scroll_background_with_speed(-30, 0, 1)
scroller.scroll_background_with_speed(-35, 0, 2)

# text
present_text = textsprite.create(str(presents_to_deliver), 1, 3) # 
present_text.scale = 1 # 
present_text.right = 160 # 
present_text.bottom = 120 # 
present_text.z = 10 #
 
def drop_present(): #
    if len(sprites.all_of_kind(SpriteKind.projectile)) < 1:
        present = sprites.create(assets.image("present"), SpriteKind.projectile)
        present.set_position(santa.x - 5, santa.y + 5)
        present.vy = santa.vy
        present.set_flag(SpriteFlag.AUTO_DESTROY, True)
controller.A.on_event(ControllerButtonEvent.PRESSED, drop_present)

def hit_bird(santa, bird):
    info.change_life_by(-1)
    bird.destroy()
sprites.on_overlap(SpriteKind.player, SpriteKind.enemy, hit_bird)

def present_lands(present, chimney): # 
    global presents_to_deliver #
    presents_to_deliver -= 1 # 
    present_text.set_text(str(presents_to_deliver)) # 
    if presents_to_deliver < 1: #
        game.over(True) #
    info.change_score_by(1000)
    present.destroy()
sprites.on_overlap(SpriteKind.projectile, SpriteKind.chimney, present_lands)

def hit_chimney(santa, chimney): # 
    info.change_life_by(-1)
    santa.vy = -40
sprites.on_overlap(SpriteKind.player, SpriteKind.chimney, hit_chimney)

def present_destroyed(present): #
    if present.top > 120:
        info.change_score_by(-1500)
sprites.on_destroyed(SpriteKind.projectile, present_destroyed)

def spawn_chimney():
    chimney = sprites.create(assets.image("chimney"), SpriteKind.chimney)
    chimney.left = 159
    chimney.bottom = 120
    chimney.vx = -40
    timer.after(randint(1000, 3000), spawn_chimney)
timer.after(randint(1000, 3000), spawn_chimney)

def spawn_bird():
    bird = sprites.create(assets.image("bird"), SpriteKind.enemy)
    animation.run_image_animation(bird, assets.animation("bird anim"), 75, True)
    bird.left = 159
    bird.y = randint(10, 110)
    bird.vx = -75
game.on_update_interval(1500, spawn_bird)

def move():
    if controller.up.is_pressed():
        santa.vy -= speed_up
    elif controller.down.is_pressed():
        santa.vy += speed_up
    santa.vy *= slow_down

def tick():
    for present in sprites.all_of_kind(SpriteKind.projectile):
        present.vy += 3    
    move()
    info.change_score_by(1)
game.on_update(tick)