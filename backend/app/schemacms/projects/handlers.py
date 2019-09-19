def handle_datasource_fsm_post_transition(sender, instance, name, source, target, **kwargs):
    if name == 'process':
        instance.update_meta()
