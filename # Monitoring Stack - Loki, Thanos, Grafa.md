# Monitoring Stack - Loki, Thanos, Grafana on AWS ECS Fargate

## Descripción

Este proyecto despliega una solución completa de monitoreo en AWS utilizando ECS Fargate, diseñada para alta disponibilidad, seguridad bancaria y facilidad de escalado.

### Componentes

- **Loki**: Agregación y almacenamiento de logs en S3.
- **Thanos + Prometheus**: Recolección y federación de métricas, almacenamiento a largo plazo en S3.
- **Grafana**: Visualización de métricas y logs.
- **ALB Interno**: Balanceo de carga interno con paths diferenciados.
- **Service Discovery**: Comunicación interna por DNS en VPC.
- **IAM Roles separados**: Mínimos privilegios por servicio.
- **S3 Gateway Endpoint**: Optimización de costos para tráfico a S3.

---

## Requerimientos

- AWS CDK (v2)
- VPC existente
- Buckets S3 creados para Loki y Thanos
- Permisos para crear ECS, IAM, ALB, Service Discovery

---

## Deploy Rápido

```bash
cdk deploy
```

---

## Estructura del Proyecto

| Servicio | Puerto     | Path ALB    | Service Discovery        | IAM Role |
| -------- | ---------- | ----------- | ------------------------ | -------- |
| Loki     | 3100       | /logs/\*    | loki.monitoring.local    | S3 RW    |
| Thanos   | 9090/10901 | /metrics/\* | thanos.monitoring.local  | S3 Read  |
| Grafana  | 3000       | /grafana/\* | grafana.monitoring.local | Opcional |

---

## Detalles Técnicos

- **Fargate Services**

  - `desiredCount: 2` mínimo
  - `maxCapacity: 4` autoescalamiento basado en CPU

- **ALB Interno**

  - Solo accesible dentro de la VPC
  - Configurado con diferentes path rules

- **Endpoints de Service Discovery**

  - Comunicación interna entre Loki, Thanos, Grafana usando DNS privado.

- **Security**

  - Tráfico solo interno.
  - Roles IAM con políticas mínimas.

- **Logging**
  - Logs de contenedores enviados a CloudWatch Logs.

---

## Variables que debes ajustar

- `vpcId`: ID de tu VPC existente.
- `your-logs-bucket`: Nombre del bucket S3 para logs.
- `your-metrics-bucket`: Nombre del bucket S3 para métricas.

---

## Tips para Producción

- Configura alarmas en CloudWatch para errores 5XX en ALB.
- Utiliza certificados ACM privados si decides exponer servicios vía HTTPS.
- Configura backups del bucket S3 con versionado y políticas de ciclo de vida.
- Puedes agregar autenticación OAuth2 o SSO a Grafana para acceso controlado.

---

## Estado

✅ Testeado en AWS us-east-1 con VPC privada, ECS Fargate y S3.

---

¡Listo para producción bancaria! 🚀
