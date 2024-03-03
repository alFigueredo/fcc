import socket
import ipaddress
import common_ports


def get_open_ports(target, port_range, verbose=False):
  open_ports = []
  ip = is_ip_or_hostname(target)
  if ip[0:5] == "Error":
    return ip
  hostname = get_hostname(target)
  for port in range(port_range[0], port_range[1] + 1):
    isOpen = try_connection(ip, port)
    if isOpen:
      open_ports.append(port)
  if verbose:
    return get_verbose_output(hostname, ip, open_ports)
  return (open_ports)


def try_connection(ip, port):
  s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  s.settimeout(1)
  isNotOpen = s.connect_ex((ip, port))
  s.close()
  return not isNotOpen


def get_verbose_output(host_name, ip, open_ports):
  if host_name == ip:
    output = f"Open ports for {host_name}\nPORT     SERVICE"
  else:
    output = f"Open ports for {host_name} ({ip})\nPORT     SERVICE"
  for port in open_ports:
    output += "\n"
    output += f"{port}{' '*(9-len(str(port)))}{get_service_name(port)}"
  return output


def get_service_name(port):
  return common_ports.ports_and_services.get(port, "unknown")


def get_hostname(target):
  try:
    return socket.gethostbyaddr(target)[0]
  except Exception:
    return target


def get_ip(target):
  return socket.gethostbyname(target)


def validate_ip_address(ip_address):
  try:
    ipaddress.ip_address(ip_address)
    return ip_address
  except Exception:
    return "Error: Invalid IP address"


def validate_hostname(host_name):
  try:
    ip = get_ip(host_name)
    return ip
  except Exception:
    return "Error: Invalid hostname"


def is_ip_or_hostname(target):
  array = target.split(".")
  if len(array) == 4:
    return validate_ip_address(target)
  elif len(array) > 1:
    return validate_hostname(target)
  else:
    return "Error: Invalid hostname"
