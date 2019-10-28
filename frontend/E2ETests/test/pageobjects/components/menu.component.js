class MenuComponent {
    get closeBtn() { return $('#topHeaderCloseMenuButton'); }
    get logoutBtn() { return $('#logoutBtn'); }
    get deleteProjectBtn() { return $('li=Delete Project'); }
    get confirmDeleteProjectBtn() { return $('span=Confirm'); }
    get deletionConfirmationModal() { return $('[aria-label="Confirm Removal"]'); }
    get editProjectSettingsBtn() { return $(''); }
}
export default new MenuComponent();