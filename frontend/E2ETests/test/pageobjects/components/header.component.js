class HeaderComponent {
    get menuBtn() { return $('#topHeaderOpenMenuBtn'); }
    get title() { return $('#headerTitle'); }
    get subtitle() { return $('#headerSubtitle'); }
}
export default new HeaderComponent();