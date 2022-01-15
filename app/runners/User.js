class User {
    constructor(page, username, password, world) {
        this.page = page;
        this.username = username;
        this.password = password;
        this.world = world;
    }

    async auth() {
        await this.page.waitForSelector("input#login_userid");
        await this.page.type("input#login_userid", this.username);
        await this.page.waitForSelector("input#login_password");
        await this.page.type("input#login_password", this.password);

        await Promise.all([
            this.page.click("button#login_Login"),
            this.page.waitForNavigation(),
        ]);

        await Promise.all([
            this.page.click(`[data-worldname=${this.world}]`),
            this.page.waitForNavigation(),
        ]);
    }
}

export default User;
