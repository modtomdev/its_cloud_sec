output "bastion_public_ip" {
  value = aws_instance.bastion.public_ip
}

output "docker_host_private_ip" {
  value = aws_instance.docker_host.private_ip
}

output "nlb_dns_name" {
  value = aws_lb.nlb.dns_name
}

output "ssh_command_proxy" {
  value = "ssh -i private_key.pem -o ProxyCommand='ssh -i private_key.pem -W %h:%p ec2-user@${aws_instance.bastion.public_ip}' ec2-user@${aws_instance.docker_host.private_ip}"
}