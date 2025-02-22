import { ActionIcon, Badge, Box, Divider, LoadingOverlay, Space, Title, Tooltip } from '@mantine/core';
import { useEffect, useState } from 'react';
import { BsPlusLg } from "react-icons/bs";
import ServiceRow from '../../components/PortHijack/ServiceRow';
import { porthijackServiceQuery } from '../../components/PortHijack/utils';
import { errorNotify, getErrorMessage, isMediumScreen } from '../../js/utils';
import AddNewService from '../../components/PortHijack/AddNewService';
import { useQueryClient } from '@tanstack/react-query';
import { TbReload } from 'react-icons/tb';

function PortHijack() {

    const [open, setOpen] = useState(false);
    const [tooltipAddServOpened, setTooltipAddServOpened] = useState(false);
    const [tooltipAddOpened, setTooltipAddOpened] = useState(false);
    const queryClient = useQueryClient()
    const [tooltipRefreshOpened, setTooltipRefreshOpened] = useState(false);
    const isMedium = isMediumScreen()

    const services = porthijackServiceQuery()

    useEffect(() => {
        if (services.isError)
            errorNotify("Ошибка обновления PortHijack!", getErrorMessage(services.error))
    }, [services.isError])

    const closeModal = () => { setOpen(false); }

    return <>
        <Space h="sm" />
        <Box className={isMedium ? 'center-flex' : 'center-flex-row'}>
            <Title order={4}>Перенаправление портов на прокси</Title>
            {isMedium ? <Box className='flex-spacer' /> : <Space h="sm" />}
            <Box className='center-flex'>
                <Badge size="sm" color="yellow" variant="filled" radius="xs">Сервисы: {services.isLoading ? 0 : services.data?.length}</Badge>
                <Space w="xs" />
                <Tooltip label="Добавить новый сервис" position='bottom' color="blue" opened={tooltipAddOpened}>
                    <ActionIcon color="blue" onClick={() => setOpen(true)} size="lg" radius="xs" variant="filled"
                                onFocus={() => setTooltipAddOpened(false)} onBlur={() => setTooltipAddOpened(false)}
                                onMouseEnter={() => setTooltipAddOpened(true)} onMouseLeave={() => setTooltipAddOpened(false)}><BsPlusLg size={18} /></ActionIcon>
                </Tooltip>
                <Space w="xs" />
                <Tooltip label="Обновить" position='bottom' color="indigo" opened={tooltipRefreshOpened}>
                    <ActionIcon color="indigo" onClick={() => queryClient.invalidateQueries(["porthijack"])} size="lg" radius="xs" variant="filled"
                                loading={services.isFetching}
                                onFocus={() => setTooltipRefreshOpened(false)} onBlur={() => setTooltipRefreshOpened(false)}
                                onMouseEnter={() => setTooltipRefreshOpened(true)} onMouseLeave={() => setTooltipRefreshOpened(false)}><TbReload size={18} /></ActionIcon>
                </Tooltip>
            </Box>
        </Box>
        <Space h="md" />
        <Box className="center-flex-row" style={{ gap: 20 }}>
            <LoadingOverlay visible={services.isLoading} />
            {(services.data && services.data.length > 0) ? services.data.map(srv => <ServiceRow service={srv} key={srv.service_id} />) : <>
                <Space h="xl" /> <Title className='center-flex' style={{ textAlign: "center" }} order={3}>Сервисы не найдены! Добавьте новый, нажав на кнопку "+"</Title>
                <Box className='center-flex'>
                    <Tooltip label="Добавить новый сервис" color="blue" opened={tooltipAddServOpened}>
                        <ActionIcon color="blue" onClick={() => setOpen(true)} size="xl" radius="xs" variant="filled"
                                    onFocus={() => setTooltipAddServOpened(false)} onBlur={() => setTooltipAddServOpened(false)}
                                    onMouseEnter={() => setTooltipAddServOpened(true)} onMouseLeave={() => setTooltipAddServOpened(false)}><BsPlusLg size="20px" /></ActionIcon>
                    </Tooltip>
                </Box>
            </>}
            <AddNewService opened={open} onClose={closeModal} />
        </Box>
    </>
}

export default PortHijack;