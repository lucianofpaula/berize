# Eventos

## Sistema de Eventos

Módulos se comunicam exclusivamente por eventos. Nenhum módulo importa diretamente de outro.

## Eventos do Commerce

| Evento                            | Disparo             | Payload                        |
| --------------------------------- | ------------------- | ------------------------------ |
| `commerce.product.created`        | Produto criado      | `{ productId, tenantId }`      |
| `commerce.product.updated`        | Produto atualizado  | `{ productId, tenantId }`      |
| `commerce.product.deleted`        | Produto excluído    | `{ productId, tenantId }`      |
| `commerce.order.created`          | Pedido criado       | `{ orderId, tenantId, total }` |
| `commerce.order.status_changed`   | Status alterado     | `{ orderId, from, to }`        |
| `commerce.inventory.low`          | Estoque baixo       | `{ productId, quantidade }`    |
| `commerce.inventory.out_of_stock` | Sem estoque         | `{ productId }`                |
| `commerce.coupon.used`            | Cupom usado         | `{ couponId, orderId }`        |
| `commerce.checkout.completed`     | Checkout finalizado | `{ orderId }`                  |

## Eventos do Booking

| Evento                          | Descrição             |
| ------------------------------- | --------------------- |
| `booking.appointment.created`   | Agendamento criado    |
| `booking.appointment.cancelled` | Agendamento cancelado |
| `booking.appointment.completed` | Agendamento concluído |

## Consumo

```typescript
eventBus.on("commerce.inventory.low", async (payload) => {
  await notifyTenant(payload.tenantId, {
    title: "Estoque baixo",
    message: `Produto ${payload.productId} está acabando.`,
  });
});
```

## Regra

Nenhum módulo deve conhecer a implementação interna de outro módulo. A comunicação é feita exclusivamente por eventos e dados anônimos.
