plugins {
    id("application")
}

group = "com.github.robertrad"
version = "1.0"

repositories {
    mavenCentral()
}

dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter-api:5.8.1")
    testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:5.8.1")
}

application {
    mainClass.set("com.github.robertrad.Main")
}

tasks.getByName<Test>("test") {
    useJUnitPlatform()
}