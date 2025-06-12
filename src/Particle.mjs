import * as THREE from "three"
class ParticleInfo {
    constructor(pos, acc, time, vel, radius) {
        this.pos = pos
        this.acc = acc
        this.time = time
        this.vel = vel
        this.radius = radius
    }

    updatePosition(time) {
        const dt = this.time - time
        const dx = this.vel[0] * dt + .5 * this.acc[0] * Math.pow(dt, 2)
        this.pos[0] += dx
        this.vel[0] += this.acc[0] * dt

        const dy = this.vel[1] * dt + .5 * this.acc[1] * Math.pow(dt, 2)
        this.pos[1] += dy
        this.vel[1] += this.acc[1] * dt
        this.time = time

        const displacement = new THREE.Vector2(dx, dy)

        this.pos = this.pos.add(displacement)

        return [dx, dy]
    }

    getPosition(dt) {
        const dx = this.vel[0] * dt + .5 * this.acc[0] * Math.pow(dt, 2)

        const dy = this.vel[1] * dt + .5 * this.acc[1] * Math.pow(dt, 2)

        const displacement = new THREE.Vector2(dx, dy)

        return this.pos.clone().add(displacement)
    }

    getVelocity(time) {
        return new THREE.Vector2(this.vel[0] + this.acc[0] * time, this.vel[1] + this.acc[1] * time)
    }



    // update(time, sprite) {
    //         const [dx, dy] = update(time)
    //         sprite.translateX(dx)
    //         sprite.translateY(dy)

    //         if (sprite.position.x - PARTCILE_RADIUS < bounds.left || sprite.position.x + PARTCILE_RADIUS > bounds.right) {
    //             sprite.position.x = THREE.MathUtils.clamp(sprite.position.x, bounds.left + PARTCILE_RADIUS, bounds.right - PARTCILE_RADIUS)
    //         }
    //         console.log(sprite.position.y, bounds.bottom)
    //         if (sprite.position.y - PARTCILE_RADIUS < bounds.bottom || sprite.position.y + PARTCILE_RADIUS > bounds.top) {
    //             sprite.position.y = THREE.MathUtils.clamp(sprite.position.y, bounds.bottom + PARTCILE_RADIUS, bounds.top - PARTCILE_RADIUS)
    //         }

    // }
}

export default ParticleInfo