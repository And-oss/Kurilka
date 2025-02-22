What is Kurilka?

Kurilka is a flexible firewall and traffic filter designed for CTF Attack-Defence competitions, allowing you to limit or block malicious traffic using advanced filtering techniques.

Get started with Kurilka

clone the repository and run:

python3 start.py

This will build the Docker image from the source and start Kurilka. Building from source takes longer, so using the pre-built GitHub package is recommended if start.py is not in the source root.

Kurilka runs in multithreaded mode by default, using all available system threads. It operates on port 4444 and requires a password for security. Configuration is customizable in start.py or the web interface.



Functionalities

Regex Filtering: Uses NFQUEUE with nftables. A C++ binary handles PCRE2 regex filters, blocking malicious IPv4/6 and TCP/UDP requests at the kernel level.

Firewall Rules: Create allow/deny rules via the Kurilka web interface, like iptables or ufw, powered by nftables.

Port Hijacking: Redirect traffic from one port to another, enabling proxy setups. Kurilka handles routing via nftables.

Documentation

Find backend and frontend documentation in the respective README files:

Frontend (React)

Backend (FastAPI + C++)



Main Points of Kurilka

1. Efficiency

Kurilka ensures minimal traffic overhead by leveraging a C++ core for critical functionalities.

2. Availability

Kurilka is designed for high availability, ensuring the service remains online even if filters are misconfigured. Fast rollback mechanisms prevent service interruptions.

Why "Kurilka"?

Initially focused on regex-based filters, Kurilka now integrates multiple traffic-filtering mechanisms.

Credits

Copyright (c) 2022-2025 And-oss

Star History

Это форк Firegex, он русифицирован и дорабатывается нашей командой

