import "./styles.css";
// import hi from "./stuff.js"
const nav = document.createElement("nav")
const page = document.createElement("div")

function heroSection() {
    const hero_container = document.createElement("section")
    hero_container.classList.add("hero-container")

    const hero_img = document.createElement("img")
    hero_img.src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpre00.deviantart.net%2Ffc71%2Fth%2Fpre%2Ff%2F2013%2F315%2F7%2Fe%2Fwelcome_to_the_n_h_k____nakahara_misaki_by_johnprestongc-d6tx248.png&f=1&nofb=1&ipt=b8ef57a3b707bcd0d4c89bdbe3b1ba2d1c3864e01f05277d1377769f744f3376"
    hero_img.classList.add("hero-img")

    const hero_text = document.createElement("p") 
    hero_text.textContent = "Full-Stack Development"

    const name = document.createElement("p")
    name.textContent = "Christopher Lin"

    const personal = document.createElement("div")
    personal.classList.add("personal-container")





    personal.appendChild(name)
    personal.appendChild(hero_text)
    hero_container.appendChild(personal)
    hero_container.appendChild(hero_img)


    return hero_container
}

const hero = heroSection()
const about = document.createElement("section")
const port = document.createElement("section")
const contact = document.createElement("section")
const sections = [about, port, contact, hero]

sections.forEach(section => nav.appendChild(section))

document.body.appendChild(nav)
document.body.appendChild(hero)