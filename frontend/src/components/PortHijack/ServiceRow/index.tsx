import { ActionIcon, Badge, Box, Divider, Grid, Menu, Space, Title, Tooltip } from '@mantine/core';
import React, { useState } from 'react';
import { FaPlay, FaStop } from 'react-icons/fa';
import { porthijack, Service } from '../utils';
import YesNoModal from '../../YesNoModal';
import { errorNotify, isMediumScreen, okNotify } from '../../../js/utils';
import { BsArrowRepeat, BsTrashFill } from 'react-icons/bs';
import { BiRename } from 'react-icons/bi'
import RenameForm from './RenameForm';
import ChangeDestination from './ChangeDestination';
import { useForm } from '@mantine/form';
import { MenuDropDownWithButton } from '../../MainLayout';
import { MdDoubleArrow } from "react-icons/md";

export default function ServiceRow({ service }: { service: Service }) {

    let status_color = service.active ? "teal" : "red"

    const [buttonLoading, setButtonLoading] = useState(false)
    const [tooltipStopOpened, setTooltipStopOpened] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false)
    const [renameModal, setRenameModal] = useState(false)
    const [changeDestModal, setChangeDestModal] = useState(false)
    const portInputRef = React.createRef<HTMLInputElement>()
    const isMedium = isMediumScreen()

    const form = useForm({
        initialValues: { proxy_port: service.proxy_port },
        validate: { proxy_port: (value) => (value > 0 && value < 65536) ? null : "Неверный порт прокси" }
    })

    const stopService = async () => {
        setButtonLoading(true)

        await porthijack.servicestop(service.service_id).then(res => {
            if (!res) {
                okNotify(`Сервис ${service.name} остановлен!`, `Сервис на порту ${service.public_port} был остановлен!`)
            } else {
                errorNotify(`Ошибка при остановке сервиса ${service.public_port}`, `Ошибка: ${res}`)
            }
        }).catch(err => {
            errorNotify(`Ошибка при остановке сервиса ${service.public_port}`, `Ошибка: ${err}`)
        })
        setButtonLoading(false);
    }

    const startService = async () => {
        setButtonLoading(true)
        await porthijack.servicestart(service.service_id).then(res => {
            if (!res) {
                okNotify(`Сервис ${service.name} запущен!`, `Сервис на порту ${service.public_port} был запущен!`)
            } else {
                errorNotify(`Ошибка при запуске сервиса ${service.public_port}`, `Ошибка: ${res}`)
            }
        }).catch(err => {
            errorNotify(`Ошибка при запуске сервиса ${service.public_port}`, `Ошибка: ${err}`)
        })
        setButtonLoading(false)
    }

    const deleteService = () => {
        porthijack.servicedelete(service.service_id).then(res => {
            if (!res) {
                okNotify("Сервис удален!", `Сервис ${service.name} был удален!`)
            } else
                errorNotify("Ошибка при удалении сервиса", `Ошибка: ${res}`)
        }).catch(err => {
            errorNotify("Ошибка при удалении сервиса", `Ошибка: ${err}`)
        })

    }

    return <>
        <Box className='firegex__nfregex__rowbox'>
            <Box className="firegex__nfregex__row" style={{ width: "100%", flexDirection: isMedium ? "row" : "column" }}>
                <Box>
                    <Box className="center-flex" style={{ justifyContent: "flex-start" }}>
                        <MdDoubleArrow size={30} style={{ color: "white" }} />
                        <Title className="firegex__nfregex__name" ml="xs">
                            {service.name}
                        </Title>
                    </Box>
                    <Box className="center-flex" style={{ gap: 8, marginTop: 15, justifyContent: "flex-start" }}>
                        <Badge color={status_color} radius="xs" size="md" variant="filled">{service.active ? "АКТИВЕН" : "ОСТАНОВЛЕН"}</Badge>
                        <Badge color={service.proto === "tcp" ? "cyan" : "orange"} radius="xs" size="md" variant="filled">
                            {service.proto}
                        </Badge>
                    </Box>
                    {isMedium ? null : <Space w="xl" />}
                </Box>

                <Box className={isMedium ? "center-flex" : "center-flex-row"}>
                    <Box className="center-flex-row">
                        <Badge color="lime" radius="xs" size="lg" variant="filled">
                            С {service.ip_src} :{service.public_port}
                        </Badge>
                        <Space h="sm" />
                        <Badge color="blue" radius="xs" size="lg" variant="filled">
                            <Box className="center-flex">
                                НА {service.ip_dst} :{service.proxy_port}
                            </Box>
                        </Badge>
                    </Box>
                    {isMedium ? <Space w="xl" /> : <Space h="lg" />}
                    <Box className="center-flex">
                        <MenuDropDownWithButton>
                            <Menu.Label><b>Переименовать сервис</b></Menu.Label>
                            <Menu.Item leftSection={<BiRename size={18} />} onClick={() => setRenameModal(true)}>Изменить имя сервиса</Menu.Item>
                            <Menu.Label><b>Изменить назначение</b></Menu.Label>
                            <Menu.Item leftSection={<BsArrowRepeat size={18} />} onClick={() => setChangeDestModal(true)}>Изменить назначение перенаправления</Menu.Item>
                            <Divider />
                            <Menu.Label><b>Опасная зона</b></Menu.Label>
                            <Menu.Item color="red" leftSection={<BsTrashFill size={18} />} onClick={() => setDeleteModal(true)}>Удалить сервис</Menu.Item>
                        </MenuDropDownWithButton>
                        <Space w="md" />
                        <Tooltip label="Остановить сервис" zIndex={0} color="red" opened={tooltipStopOpened}>
                            <ActionIcon color="red" loading={buttonLoading}
                                        onClick={stopService} size="xl" radius="xs" variant="filled"
                                        disabled={!service.active}
                                        aria-describedby="tooltip-stop-id"
                                        onFocus={() => setTooltipStopOpened(false)} onBlur={() => setTooltipStopOpened(false)}
                                        onMouseEnter={() => setTooltipStopOpened(true)} onMouseLeave={() => setTooltipStopOpened(false)}>
                                <FaStop size="20px" />
                            </ActionIcon>
                        </Tooltip>
                        <Space w="md" />
                        <Tooltip label="Запустить сервис" zIndex={0} color="teal">
                            <ActionIcon color="teal" size="xl" radius="xs" onClick={startService} loading={buttonLoading}
                                        variant="filled" disabled={service.active}>
                                <FaPlay size="20px" />
                            </ActionIcon>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
        </Box>

        <YesNoModal
            title='Вы уверены, что хотите удалить этот сервис?'
            description={`Вы собираетесь удалить сервис на порту '${service.public_port}'. Это приведет к остановке сервиса и удалению всех связанных правил. ⚠️`}
            onClose={() => setDeleteModal(false)}
            action={deleteService}
            opened={deleteModal}
        />
        <RenameForm
            onClose={() => setRenameModal(false)}
            opened={renameModal}
            service={service}
        />
        <ChangeDestination
            onClose={() => setChangeDestModal(false)}
            opened={changeDestModal}
            service={service}
        />
    </>
}