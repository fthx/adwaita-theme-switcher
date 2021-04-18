/* 	Adwaita Theme Switcher
	GNOME Shell extension
	(c) Francois Thirioux 2021
	License: GPLv3 	*/


const { Gio, GObject, St } = imports.gi;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

var LIGHT_THEME_NAME = 'Adwaita';
var DARK_THEME_NAME = 'Adwaita-dark';
var LIGHT_THEME_ICON = 'daytime-sunset-symbolic';
var DARK_THEME_ICON = 'daytime-sunrise-symbolic';


var AdwaitaIndicator = GObject.registerClass(
class AdwaitaIndicator extends PanelMenu.Button {
	_init() {
		super._init(0.0, 'Adwaita Theme Switcher');

		this.hbox = new St.BoxLayout({visible: true, reactive: true, can_focus: true, track_hover: true}); 
		this.icon = new St.Icon({ icon_name: 'dialog-warning-symbolic', style_class: 'system-status-icon' });
		
		this.schema = Gio.Settings.new('org.gnome.desktop.interface');
		switch (this.schema.get_string('gtk-theme')) {
			case LIGHT_THEME_NAME:
				this.icon.icon_name = LIGHT_THEME_ICON;
			break;
			case DARK_THEME_NAME:
				this.icon.icon_name = DARK_THEME_ICON;
			break;
			default:
				Main.notify("Adwaita themes not found.");
		}
		
		this.hbox.add_child(this.icon);
		this.add_child(this.hbox);
		this.click = this.connect("button-press-event", this._toggle_theme.bind(this));
	}
	
	_toggle_theme() {
		switch (this.schema.get_string('gtk-theme')) {
			case LIGHT_THEME_NAME:
				this.schema.set_string("gtk-theme", DARK_THEME_NAME);
				this.icon.icon_name = DARK_THEME_ICON;
			break;
			case DARK_THEME_NAME:
				this.schema.set_string("gtk-theme", LIGHT_THEME_NAME);
				this.icon.icon_name = LIGHT_THEME_ICON;
			break;
			default:
				Main.notify("Adwaita themes not found.");
		}
	}
	
	_destroy() {
		this.disconnect(this.click);
		super.destroy();
	}
});

class Extension {
    constructor() {
    }

    enable() {
		this._indicator = new AdwaitaIndicator();
		Main.panel.addToStatusArea('adwaita-theme-indicator', this._indicator);
    }

    disable() {
    	this._indicator._destroy();
    }
}

function init() {
	return new Extension();
}
