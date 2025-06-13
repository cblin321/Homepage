import gsap from "gsap"
import ScrollTrigger from "gsap/ScrollTrigger.js"
import "./styles.css"
import ParticleInfo from "./Particle.mjs"
import circle from "./circle.png"
import * as THREE from "three"
import envelope_icon from "./icons/envelope-solid.svg"
import github_icon from "./icons/github-brands.svg"
import linkedin_icon from "./icons/linkedin-brands.svg"
import addr_icon from "./icons/address-book-solid.svg"
import phone_icon from "./icons/phone-solid.svg"
import inbox_icon from "./icons/inbox-solid.svg"
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


const AppendSVGDOM = (url, parent, href) => {
    fetch(url).then(resp => resp.text()).then(resp => {
            const parser = new DOMParser()
            const svg = parser.parseFromString(resp, "text/html").body.firstElementChild
            svg.classList.add("icon")
            if (href !== null && href !== undefined) {
                const link = document.createElement("a")
                link.href = href
                link.appendChild(svg)
                parent.appendChild(link)
                return
            }
            parent.appendChild(svg)
        }
    )
}

function heroSection() {
    const hero_container = document.createElement("section")
    hero_container.id = "hero"

    const hero_img = document.createElement("img")
    hero_img.src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpre00.deviantart.net%2Ffc71%2Fth%2Fpre%2Ff%2F2013%2F315%2F7%2Fe%2Fwelcome_to_the_n_h_k____nakahara_misaki_by_johnprestongc-d6tx248.png&f=1&nofb=1&ipt=b8ef57a3b707bcd0d4c89bdbe3b1ba2d1c3864e01f05277d1377769f744f3376"
    hero_img.classList.add("hero-img")

    const hero_text = document.createElement("p") 
    hero_text.textContent = "Full-Stack Development"
    hero_text.classList.add("hero-subtitle")

    const name = document.createElement("p")
    name.classList.add("name")
    name.textContent = "Christopher Lin"

    const personal = document.createElement("div")
    personal.classList.add("personal-container")

    const icon_container = document.createElement("div")
    icon_container.classList.add("icon-container")


    AppendSVGDOM(envelope_icon, icon_container, "#contact")
    AppendSVGDOM(github_icon, icon_container, "")
    AppendSVGDOM(linkedin_icon, icon_container, "")

    personal.appendChild(icon_container)

    animateScroll([personal, hero_img])

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
    const PARTCILE_RADIUS = 250 
    const sprites = []

    const info = []
    const numSprites = 2

    for (let i = 0; i < numSprites; i++) {
        const sprite = new THREE.Sprite()
        sprite.position.set(i * (PARTCILE_RADIUS + 10), 0, 1)
        sprites.push(sprite)

        //TODO change mass from constant
        const position = new THREE.Vector2(i * (PARTCILE_RADIUS + 100), 0)
        const spriteInfo = new ParticleInfo(position, [0, 0], 0, [0, 50], PARTCILE_RADIUS)
        info.push(spriteInfo)

        sprite.scale.set(PARTCILE_RADIUS, PARTCILE_RADIUS, 1)
    }
    // const sprite = new THREE.Sprite(mat)
    sprites.forEach(sprite => scene.add(sprite))
    const renderer = new THREE.WebGLRenderer()
    const clock = new THREE.Clock()
    // renderer.setClearColor(0xffffff)
    renderer.setSize(window.innerWidth, window.innerHeight)
    // document.body.appendChild(renderer.domElement)
    
    function updateSprites() {
        for (let i = 0; i < info.length; i++) {
            const spriteInfo = info[i]
            const sprite = sprites[i]
            const time = clock.getElapsedTime()
            const [dx, dy] = spriteInfo.updatePosition(time)
            // console.log(dx, dy)
            sprite.translateX(dx)
            sprite.translateY(dy)
            spriteInfo.pos = new THREE.Vector2(sprite.position.x, sprite.position.y)
            if (sprite.position.y + PARTCILE_RADIUS < bounds.bottom) { 
                sprite.position.y = bounds.top + spriteInfo.radius
                continue
            }

            if (sprite.position.y - PARTCILE_RADIUS > bounds.top) {
                sprite.position.y = bounds.bottom - spriteInfo.radius
                continue
            }

        }

    }

    function animate() {
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

gsap.registerPlugin(ScrollTrigger)

function HTMLCollectionToArr(collection) {
    return [].slice.call(collection)
}

function animateScroll(elements) {
    console.log(elements)

    const leaveFunc = (element) => {
        gsap.fromTo(element, {
            autoAlpha: 1,
        }, 
        {
            autoAlpha: 0,
            overwrite: "auto"
        })
    }

    elements.forEach(element => {
        ScrollTrigger.create({
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            // markers: true,
            // fastScrollEnd: true,
            // pin: true,
            // scrub: true,
            onEnter: () => {
                gsap.fromTo(element, {
                    autoAlpha: 0,
                    y: 100
                }, 
                {
                    duration: 1.5,
                    autoAlpha: 1,
                    ease: "back",
                    y: 0,
                    overwrite: "auto"

                })
            },
            onEnterBack: () => {
                gsap.fromTo(element, {
                    autoAlpha: 0,
                    y: -100
                }, 

                {
                    duration: 1.5,
                    autoAlpha: 1,
                    ease: "back",
                    y: 0,
                    overwrite: "auto"
                })
            },
            onLeave: () => {
                gsap.fromTo(element, {
                    autoAlpha: 1,
                }, 
                {
                    autoAlpha: 0,
                    overwrite: "auto"
                })        
            },
            onLeaveBack: () => {
                gsap.fromTo(element, {
                    autoAlpha: 1,
                }, 
                {
                    autoAlpha: 0,
                    overwrite: "auto"
                })        
            },
        })
    })
}

function portfolioSection() {
    const portfolio_header = document.createElement("h1")
    portfolio_header.classList.add("section-header")
    portfolio_header.textContent = "My Work"

    const animation_container = document.createElement("div")
    animation_container.classList.add("animation-container")

    const portfolio_section = document.createElement("section")
    portfolio_section.id = "portfolio"

    const portfolio_grid = document.createElement("div")
    portfolio_grid.classList.add("port-projects")

    const asyncAppendSVGDOM = async (url, href) => {
        let resp = await fetch(url)
        resp = await resp.text()
        console.log(resp)
            const parser = new DOMParser()
            const svg = parser.parseFromString(resp, "text/html").body.firstElementChild
            svg.classList.add("icon")

            // if (href !== null && href !== undefined) {
            //     const link = document.createElement("a")
            //     link.href = href
            //     link.appendChild(svg)
            //     return link
            // }


            return svg
    }

    const getPortfolioEntry = async (proj_name, desc, img) => {
        const project_container = document.createElement("div")
        project_container.classList.add("proj-container")
        const project_img = document.createElement("img")
        project_img.classList.add("proj-img")
        project_img.src = img


        const btn = document.createElement("button")
        const btn_text = document.createElement("p")
        btn_text.textContent = "See Project"
        btn.appendChild(btn_text)
        // const label = document.createElement("p")
        // label.textContent = "Check it out"

        const svg = await asyncAppendSVGDOM(github_icon, "")
        console.log(svg)

        btn.appendChild(svg)


        const project_info_container = document.createElement("div")
        project_info_container.classList.add("proj-info-container")
        const project_name = document.createElement("p")
        project_name.classList.add("proj-name")
        project_name.textContent = proj_name


        const project_desc = document.createElement("p")
        project_desc.classList.add("proj-desc")
        project_desc.textContent = desc

        project_container.appendChild(project_img)
        project_info_container.appendChild(project_name)
        project_info_container.appendChild(project_desc)
        project_info_container.appendChild(btn)
        project_container.appendChild(project_info_container)

        
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
        // portfolio_grid.appendChild(getPortfolioEntry(names[i], descriptions[i], imgs[i]).then(entry => portfolio_grid.appendChild(entry)))
        getPortfolioEntry(names[i], descriptions[i], imgs[i]).then(entry => portfolio_grid.appendChild(entry))

    // const elements = [portfolio_header, portfolio_grid]
    // animateScroll(elements)

    const elements = [animation_container]
    animateScroll(elements)

    animation_container.appendChild(portfolio_header)
    animation_container.appendChild(portfolio_grid)

    portfolio_section.appendChild(animation_container)


    return portfolio_section
}

function contactSection() {
    const ContactContainer = (textElement) => {
        const container = document.createElement("div")
        container.appendChild(textElement)
        container.classList.add("contact-container")
        return container
    }

    const section = document.createElement("section")
    section.id = "about"

    const info_container = document.createElement("div")
    info_container.classList.add("info-container")
    
    //header
    const header = document.createElement("h2")
    header.textContent = "Contact Me"

    const subtitle = document.createElement("h3")
    subtitle.textContent = "Please get in touch if you think our work could be mutually beneficial!"
    //email
    const email = document.createElement("p")
    email.textContent = "test@example.com"
    const emailContainer = ContactContainer(email)
    AppendSVGDOM(inbox_icon, emailContainer, "mailto:email@example.com")

    //phone
    const phone = document.createElement("p")
    phone.textContent = "123-123-1234"
    const phoneContainer = ContactContainer(phone)
    AppendSVGDOM(phone_icon, phoneContainer, "")

    //addr
    const addr = document.createElement("p")
    addr.textContent = "123 Please Contact Me"
    const addrContainer = ContactContainer(addr)
    AppendSVGDOM(addr_icon, addrContainer, "")

    //icons?
    info_container.appendChild(header)
    info_container.appendChild(subtitle)
    // info_container.appendChild(addr)
    // info_container.appendChild(email)
    // info_container.appendChild(phone)

    info_container.appendChild(addrContainer)
    info_container.appendChild(emailContainer)
    info_container.appendChild(phoneContainer)

    const contact_img = document.createElement("img")
    contact_img.src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.anime-planet.com%2Fcharacters%2Fprimary%2Fmisaki-nakahara-1-190x266.jpg%3Ft%3D1625965267&f=1&nofb=1&ipt=693022fbf00a5a041a3dde4bb127bbb76dd66992d32bb79ed9c6fd4c6acaa750"

    section.appendChild(info_container)
    section.appendChild(contact_img)

    const elements = [info_container]

    // animateScroll(elements)

    return section
}

const section_container = document.createElement("div")
section_container.classList.add("sections")

const hero = heroSection()
document.body.appendChild(hero)

const about = document.createElement("section")
about.id = "about"

const port = portfolioSection()

const contact = contactSection()
contact.id = "contact"

// const sections = [hero, about, port, contact, ]
const sections = [hero, port, contact]

// animateScroll(sections)

// sections.forEach(section => section_container.appendChild(section))
sections.forEach(section => document.body.appendChild(section))

// document.body.appendChild(section_container)

// document.body.appendChild(nav)