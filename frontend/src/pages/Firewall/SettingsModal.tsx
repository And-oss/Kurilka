import { Button, Group, Space, Modal, Switch } from '@mantine/core';
import { useEffect, useState } from 'react';
import { errorNotify, okNotify } from '../../js/utils';
import { FirewallSettings, firewall } from '../../components/Firewall/utils';

export function SettingsModal({ opened, onClose }: { opened: boolean, onClose: () => void }) {

    const [settings, setSettings] = useState<FirewallSettings>({} as FirewallSettings);

    useEffect(() => {
        firewall.settings().then(res => {
            setSettings(res);
        }).catch(err => {
            errorNotify("Ошибка получения настроек!", err.toString());
            onClose();
        });
    }, []);

    const [submitLoading, setSubmitLoading] = useState(false);

    const submitRequest = () => {
        setSubmitLoading(true);
        firewall.setsettings(settings).then(() => {
            okNotify("Настройки обновлены!", "Настройки успешно обновлены");
            setSubmitLoading(false);
            onClose();
        }).catch(err => {
            errorNotify("Ошибка обновления настроек!", err.toString());
            setSubmitLoading(false);
        });
    };

    return (
        <Modal size="xl" title="Изменение настроек Firewall" opened={opened} onClose={onClose} closeOnClickOutside={false} centered>
            <Switch
                label="Сохранять правила при выключении Firegex"
                checked={settings.keep_rules}
                onChange={v => setSettings({ ...settings, keep_rules: v.target.checked })}
            />
            <Space h="md" />
            <Switch
                label="Разрешить loopback-соединения"
                checked={settings.allow_loopback}
                onChange={v => setSettings({ ...settings, allow_loopback: v.target.checked })}
            />
            <Space h="md" />
            <Switch
                label="Разрешить установленные соединения (важно для открытия соединений) (Опасно отключать)"
                checked={settings.allow_established}
                onChange={v => setSettings({ ...settings, allow_established: v.target.checked })}
            />
            <Space h="md" />
            <Switch
                label="Разрешить ICMP-пакеты"
                checked={settings.allow_icmp}
                onChange={v => setSettings({ ...settings, allow_icmp: v.target.checked })}
            />
            <Space h="md" />
            <Switch
                label="Разрешить multicast DNS"
                checked={settings.multicast_dns}
                onChange={v => setSettings({ ...settings, multicast_dns: v.target.checked })}
            />
            <Space h="md" />
            <Switch
                label="Разрешить протокол UPnP"
                checked={settings.allow_upnp}
                onChange={v => setSettings({ ...settings, allow_upnp: v.target.checked })}
            />
            <Space h="md" />
            <Switch
                label="Отбрасывать невалидные пакеты"
                checked={settings.drop_invalid}
                onChange={v => setSettings({ ...settings, drop_invalid: v.target.checked })}
            />
            <Space h="md" />
            <Switch
                label="Разрешить DHCP"
                checked={settings.allow_dhcp}
                onChange={v => setSettings({ ...settings, allow_dhcp: v.target.checked })}
            />
            <Group align="right" mt="md">
                <Button loading={submitLoading} onClick={submitRequest}>Сохранить настройки</Button>
            </Group>
        </Modal>
    );
}