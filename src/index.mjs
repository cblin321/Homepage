import "./styles.css";
import ParticleInfo from "./Particle.mjs";
import circle from "./circle.png"
import * as THREE from "three"
// import hi from "./stuff.js"
const page = document.createElement("div")


function navBar() {
    const navContainer = document.createElement("nav")
    const getNavLink = (section_id, link_text) => {
        const linkContainer = document.createElement("div")
        const link = document.createElement("a")
        link.href = `#${section_id}`
        link.textContent = link_text
        linkContainer.appendChild(link)

        return linkContainer
    }

    navContainer.appendChild(getNavLink("about", "About"))
    navContainer.appendChild(getNavLink("contact", "Contact"))
    navContainer.appendChild(getNavLink("port", "Portfolio"))

    return navContainer
}

const nav = navBar()

function heroSection() {
    const hero_container = document.createElement("section")
    hero_container.id = "hero"

    const hero_img = document.createElement("img")
    hero_img.src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpre00.deviantart.net%2Ffc71%2Fth%2Fpre%2Ff%2F2013%2F315%2F7%2Fe%2Fwelcome_to_the_n_h_k____nakahara_misaki_by_johnprestongc-d6tx248.png&f=1&nofb=1&ipt=b8ef57a3b707bcd0d4c89bdbe3b1ba2d1c3864e01f05277d1377769f744f3376"
    hero_img.classList.add("hero-img")

    const hero_text = document.createElement("p") 
    hero_text.textContent = "Full-Stack Development"

    const name = document.createElement("p")
    name.textContent = "Christopher Lin"

    const personal = document.createElement("div")
    personal.classList.add("personal-container")

    const aspectRatio = window.innerWidth / window.innerHeight
    const viewSize = 500
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-aspectRatio * viewSize / 2, aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2, -500, 500)
    camera.position.z = 50

    const textureLoader = new THREE.TextureLoader()
    const map = textureLoader.load(circle)
    const mat = new THREE.SpriteMaterial({map: map, color: 0x001230})

    const bounds = { left: -aspectRatio * viewSize / 2, right: aspectRatio * viewSize / 2, top: viewSize / 2, bottom: -viewSize / 2, }

    // const info = new ParticleInfo([0, 0], [5, -9.8], 0, [0, 0])
    //TODO allow the user to change this
    const coefOfRest = 1
    const PARTCILE_RADIUS = 50
    const sprites = []

    const info = []
    const numSprites = 9

    for (let i = 0; i < numSprites; i++) {
        const sprite = new THREE.Sprite()
        sprite.position.set(i * (PARTCILE_RADIUS + 2), 0, 1)
        sprites.push(sprite)

        //TODO change mass from constant
        const position = new THREE.Vector2(i * (PARTCILE_RADIUS + 2), 0)
        const spriteInfo = new ParticleInfo(position, [0, -9.8], 0, [50, 0], 1)
        info.push(spriteInfo)

        sprite.scale.set(PARTCILE_RADIUS, PARTCILE_RADIUS, 1)
    }
    // const sprite = new THREE.Sprite(mat)
    sprites.forEach(sprite => scene.add(sprite))
    const renderer = new THREE.WebGLRenderer()
    const clock = new THREE.Clock()
    // renderer.setClearColor(0xffffff)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

function resolveCollision(spriteIdxA, spriteIdxB, toi) {
        const spriteA = sprites[spriteIdxA]
        const spriteInfoA = info[spriteIdxA]

        const spriteB = sprites[spriteIdxB]
        const spriteInfoB = info[spriteIdxB]
        if (toi > 0) {
            //TODO move to the point of impact
            if (spriteA.position.x - PARTCILE_RADIUS < bounds.left || spriteA.position.x + PARTCILE_RADIUS > bounds.right) {
                spriteInfoA.vel[0] *= -1
            }
            if (spriteB.position.x - PARTCILE_RADIUS < bounds.left || spriteB.position.x + PARTCILE_RADIUS > bounds.right) {
                spriteInfoB.vel[0] *= -1
            }

            if (spriteA.position.y - PARTCILE_RADIUS < bounds.top || spriteA.position.y + PARTCILE_RADIUS > bounds.bottom) {
                spriteInfoA.vel[1] *= -1
            }
            if (spriteB.position.y - PARTCILE_RADIUS < bounds.top || spriteB.position.y + PARTCILE_RADIUS > bounds.bottom) {
                spriteInfoB.vel[1] *= -1
            }


            const time = clock.getElapsedTime()
            const [dx, dy] = spriteInfo.updateVelocity(time)
            sprite.translateX(dx)
            sprite.translateY(dy)

            spriteInfo.pos = new THREE.Vector2(sprite.position.x, sprite.position.y)

        }
    const normalVec = spriteInfoA.pos.clone().sub(spriteInfoB.pos.clone()).normalize()

    const tanVec = new THREE.Vector2(-normalVec.y, normalVec.x)

    const velA = new THREE.Vector2(spriteInfoA.vel[0], spriteInfoA.vel[1])

    const velB = new THREE.Vector2(spriteInfoB.vel[0], spriteInfoB.vel[1])



    const vAn = normalVec.clone().dot(velA)
    const vBn = normalVec.clone().dot(velB)

    
    const vAt = tanVec.clone().dot(velA)
    const vBt = tanVec.clone().dot(velB)

     
    //compute new velocity in normal direction
    const vAnf = (vAn * (spriteInfoA.mass - spriteInfoB.mass) + 2 * spriteInfoB.mass * vBn) / (spriteInfoA.mass + spriteInfoB.mass)
    const vBnf = (vBn * (spriteInfoB.mass - spriteInfoA.mass) + 2 * spriteInfoA.mass * vAn) / (spriteInfoA.mass + spriteInfoB.mass)


    const velAFinal = normalVec.clone().multiplyScalar(vAnf).add(tanVec.clone().multiplyScalar(vAt))
    const velBFinal = normalVec.clone().multiplyScalar(vBnf).add(tanVec.clone().multiplyScalar(vBt))

    return [velAFinal, velBFinal]
}

function checkCollision(spriteInfoA, spriteInfoB) {
    //check whether a collision will happen between frames
    //need position, find time
    const deltaTime = clock.getDelta()
    const velA = new THREE.Vector2(spriteInfoA.vel[0], spriteInfoA.vel[1])
    const accA = new THREE.Vector2(spriteInfoA.acc[0], spriteInfoA.acc[1])

    const velB = new THREE.Vector2(spriteInfoB.vel[0], spriteInfoB.vel[1])
    const accB = new THREE.Vector2(spriteInfoB.acc[0], spriteInfoB.acc[1])
    const toi = solveTOIWithAcceleration(spriteInfoA.pos, velA, accA, PARTCILE_RADIUS,
        spriteInfoB.pos, velB, accB, PARTCILE_RADIUS
    )

    return toi
}
function solveTOIWithAcceleration(posA, velA, accA, radiusA, posB, velB, accB, radiusB) {
    const r0 = posA.clone().sub(posB);
    const v = velA.clone().sub(velB);
    const a = accA.clone().sub(accB);

    const R = radiusA + radiusB;
    const R2 = R * R;

    // Coefficients for quartic: (r0 + v t + 0.5 a t^2)^2 = R^2
    // Expand (r0 + v t + 0.5 a t^2)·(r0 + v t + 0.5 a t^2) - R^2 = 0

    const A = 0.25 * a.dot(a);
    const B = a.dot(v);
    const C = v.dot(v) + a.dot(r0);
    const D = 2 * v.dot(r0);
    const E = r0.dot(r0) - R2;

    // Solve quartic: A t^4 + B t^3 + C t^2 + D t + E = 0

    // Using a numeric root solver (Newton, Durand-Kerner, or library) is easiest,
    // but here we use a simple numeric approach: sample t from 0 to 1 with small steps.

    const roots = [];

    const step = 0.001;
    for (let t = 0; t <= 1; t += step) {
        const val = ((A * t + B) * t + C) * t * t + D * t + E;
        if (Math.abs(val) < 1e-6) roots.push(t);
    }

    if (roots.length === 0) return null;

    // Return the smallest positive root in [0,1]
    const toi = Math.min(...roots.filter(t => t >= 0 && t <= 1));

    return toi || null;
}

    function findCollisions() {
        for (let i = 0; i < sprites.length; i++)  {

            for (let j = 0; j < sprites.length; j++)  {
                if (i === j)
                    continue                    

                const spriteInfoA = info[i]
                const spriteInfoB = info[j]
                    // console.log(checkCollision(sprites[i], sprites[j]))
                    // console.log(sprites[i], sprites[j])
                if (checkCollision(sprites[i], sprites[j])) {
                    console.log("collide")
                    // const delta = spriteInfoA.pos.clone().sub(spriteInfoB.pos)
                    // const dist = delta.length()
                    // const overlap = PARTCILE_RADIUS * 2 - dist
                    // if (overlap > 0) {
                    //     const correction = delta.normalize().multiplyScalar(overlap / 2)
                    //     spriteInfoA.pos.add(correction)
                    //     spriteInfoB.pos.sub(correction)

                    //     sprites[i].position.setX(spriteInfoA.pos.x)
                    //     sprites[i].position.setY(spriteInfoA.pos.y)

                    //     sprites[j].position.setX(spriteInfoB.pos.x)
                    //     sprites[j].position.setY(spriteInfoB.pos.y)
                    // }
                    const [finalA, finalB] = resolveCollision(spriteInfoA, spriteInfoB)
                    spriteInfoA.vel = [finalA.x, finalA.y]
                    spriteInfoB.vel = [finalB.x, finalB.y]

                }
            }
        }
    }
    
    function updateSprites() {
        for (let i = 0; i < info.length; i++) {
            const spriteInfo = info[i]
            const sprite = sprites[i]
            if (sprite.position.x - PARTCILE_RADIUS < bounds.left || sprite.position.x + PARTCILE_RADIUS > bounds.right) {
                spriteInfo.vel[0] *= -1
            }

            if (sprite.position.y - PARTCILE_RADIUS < bounds.bottom || sprite.position.y + PARTCILE_RADIUS > bounds.top) {
                spriteInfo.vel[1] *= -1
            }

            const time = clock.getElapsedTime()
            const [dx, dy] = spriteInfo.updateVelocity(time)
            sprite.translateX(dx)
            sprite.translateY(dy)

            spriteInfo.pos = new THREE.Vector2(sprite.position.x, sprite.position.y)

        }
    }

    function animate() {
        findCollisions()
        updateSprites()
        renderer.render(scene, camera)
    }

    renderer.setAnimationLoop(animate)




    personal.appendChild(name)
    personal.appendChild(hero_text)
    hero_container.appendChild(personal)
    hero_container.appendChild(hero_img)


    return hero_container
}

function portfolioSection() {
    const portfolio_grid = document.createElement("section")
    portfolio_grid.id = "portfolio"

    const getPortfolioEntry = (proj_name, desc, img) => {
        const project_container = document.createElement("div")
        const project_img = document.createElement("img")
        project_img.src = img

        const project_name = document.createElement("p")
        project_name.textContent = proj_name

        const project_desc = document.createElement("p")
        project_desc.textContent = desc

        project_container.appendChild(project_img)
        project_container.appendChild(project_name)
        project_container.appendChild(project_desc)

        return project_container
    }

    const names = ["Battleship", "RSA", "Homepage", "Git Visualizer"]
    const descriptions = [
        "Battleship game built in in vanilla JS, JEST for testing", 
        "ML predictor to identify arbitrage opportunities",
        "This page!", "Git visualizer to git gud"]

    const imgs = [
       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F26%2F15%2F34%2F261534a5888cbcb1399937a0403f01a9--misaki-cosplay-ideas.jpg&f=1&nofb=1&ipt=3964f88e1988580be7594829713cbbf7e4978bb49d6bbc5926b371200bf2e0a7",
       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fp4.wallpaperbetter.com%2Fwallpaper%2F377%2F972%2F955%2Fwelcome-to-the-nhk-school-uniform-schoolgirl-nakahara-misaki-wallpaper-preview.jpg&f=1&nofb=1&ipt=85e8d964e4b0fe5ec57589a2218a4d061b1875200a63d73616052fc2e95b7fd2",
       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.zerochan.net%2FNakahara.Misaki.full.165493.jpg&f=1&nofb=1&ipt=a44620abd5e0b26b391c17e0609ad93daa36e1d2ff7e6e97a0002dffa1e4d4ad",
       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fyandere%2Fimages%2F8%2F85%2FMisaki_.jpg%2Frevision%2Flatest%3Fcb%3D20210514045933&f=1&nofb=1&ipt=9bff293198472280004f47ce44dd2e0cc35f263b96a23784771d0475931a9961"
    ]

    for (let i = 0; i < names.length; i++)
        portfolio_grid.appendChild(getPortfolioEntry(names[i], descriptions[i], imgs[i]))

    return portfolio_grid
}

const hero = heroSection()
document.body.appendChild(hero)

const about = document.createElement("section")
about.id = "about"

const port = portfolioSection()

const contact = document.createElement("section")
contact.id = "contact"

const sections = [hero, about, port, contact, ]

sections.forEach(section => document.body.appendChild(section))

document.body.appendChild(nav)