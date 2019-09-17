def handle_datasource_fsm_post_transition(sender, instance, name, source, target, **kwargs):
    if name == 'preview_process':
        instance.update_meta()
