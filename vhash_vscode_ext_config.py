from cpbox.app import xapp_contracts
from cpbox.xkit.tools import profiles


CONFIG_FILE = 'xapp-keys/apps/vhash-vscode-ext/vhash-vscode-ext-secrets.yml'
PUBLISH_SECTION = 'publish'


class VhashVscodeExtConfig:
    def __init__(self, profile=''):
        config = xapp_contracts.load_layered_config_file(CONFIG_FILE)
        _, self._publish_profile = profiles.select_profile_from_config(config[PUBLISH_SECTION], profile=profile)

    def azure_devops_pat_for_vsce(self):
        return self._publish_profile.required_str('azure_devops_pat_for_vsce')

    def openvsx_pat(self):
        return self._publish_profile.required_str('openvsx_pat')
