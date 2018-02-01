var FormController = Composer.Controller.extend({
	elements: {
		'.button.submit': 'btn_submit',
		'.button-row .desc': 'el_desc'
	},

	events: {
		'submit form': 'submit',
		'click .button.submit': 'do_submit',
		'click .button.cancel': 'cancel'
	},

	buttons: true,
	button_tabindex: null,
	formclass: 'standard-form',
	action: null,
	footer_actions: [],
	disabled: false,
	show_cancel: true,

	init: function()
	{
		turtl.keyboard.detach();	// disable keyboard shortcuts while editing
		// ...BUT close on escape
		var key_handler = function(e) {
			var ctrl_or_cmd = e.control || e.meta;
			if(e.key == 'esc') return this.trigger('cancel');
			if(ctrl_or_cmd && (e.key == 'enter' || e.key == 'return')) {
				return this.submit(e);
			}
		}.bind(this);
		document.body.addEvent('keydown', key_handler);
		this.bind('release', function() {
			turtl.keyboard.attach();
			document.body.removeEvent('keydown', key_handler);
		});
		if(!this.action) this.action = i18next.t('Create');
		return this.parent.apply(this, arguments);
	},

	html: function(content)
	{
		return this.parent(view.render('modules/form-layout', {
			action: this.action,
			formclass: this.formclass,
			buttons: this.buttons,
			tabindex: this.button_tabindex,
			content: content,
			footer_actions: this.footer_actions,
			show_cancel: this.show_cancel,
			disabled: this.disabled,
		}));
	},

	submit: function(e)
	{
		console.warn('formcontroller: submit: override me');
	},

	cancel: function(e)
	{
		this.trigger('cancel');
	},

	set_desc: function(text)
	{
		if(!this.el_desc) return;
		this.el_desc.set('html', text);
	},

	highlight_button: function()
	{
		if(this.el.getElement('div.highlight')) return;
		var dot = new Element('div').addClass('highlight').set('html', '&nbsp;');
		dot.inject(this.btn_submit);
		Velocity(dot, {opacity: [1, 0]}, {duration: 400});
		Velocity(dot, 'callout.pulse', {duration: 800});
	},

	check_errors: function(errors)
	{
		if(errors.length == 0) return true;

		errors.slice(0).reverse().forEach(function(err) {
			barfr.barf(err[1]);
			var inp = err[0];
			inp.addClass('error');
			setTimeout(function() { inp.removeClass('error'); }, 8000);
		});
		errors[0][0].focus();
	},

	submit: function(e)
	{
		console.log('form: submit: overwrite me');
	},

	do_submit: function(e)
	{
		if(this.disabled)
		{
			if(e) e.stop();
			return;
		}
		this.submit(e);
	},

	requires_connection: function(options)
	{
		options || (options = {});

		var connect_barf = null;
		var close_barf = function() {
			if(!connect_barf) return;
			barfr.close_barf(connect_barf);
			connect_barf = null;
		};
		var check_disconnect = function()
		{
			close_barf();
			if(turtl.connected)
			{
				this.disable(false);
			}
			else
			{
				connect_barf = barfr.barf(options.msg);
				this.disable(true);
			}
		}.bind(this);
		this.with_bind(turtl.events, 'sync:connected', check_disconnect);
		check_disconnect();
		this.bind('xdom:render', check_disconnect);
	},

	disable: function(yesno)
	{
		if(yesno)
		{
			this.disabled = true;
			if(this.btn_submit) this.btn_submit.addClass('disabled');
		}
		else
		{
			this.disabled = false;
			if(this.btn_submit) this.btn_submit.removeClass('disabled');
		}
	}
});

