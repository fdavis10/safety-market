from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("catalog", "0001_initial"),
        ("orders", "0002_telegramadmin"),
    ]

    operations = [
        migrations.AddField(
            model_name="cartitem",
            name="package",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="cart_items",
                to="catalog.package",
                verbose_name="пакет",
            ),
        ),
        migrations.AlterField(
            model_name="cartitem",
            name="service",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="cart_items",
                to="catalog.service",
                verbose_name="услуга",
            ),
        ),
        migrations.RemoveConstraint(
            model_name="cartitem",
            name="uniq_cart_session_service",
        ),
        migrations.AddConstraint(
            model_name="cartitem",
            constraint=models.UniqueConstraint(
                condition=models.Q(("service__isnull", False)),
                fields=("session_key", "service"),
                name="uniq_cart_session_service",
            ),
        ),
        migrations.AddConstraint(
            model_name="cartitem",
            constraint=models.UniqueConstraint(
                condition=models.Q(("package__isnull", False)),
                fields=("session_key", "package"),
                name="uniq_cart_session_package",
            ),
        ),
        migrations.AddConstraint(
            model_name="cartitem",
            constraint=models.CheckConstraint(
                condition=models.Q(
                    models.Q(("package__isnull", True), ("service__isnull", False)),
                    models.Q(("package__isnull", False), ("service__isnull", True)),
                    _connector="OR",
                ),
                name="cart_item_exactly_one_target",
            ),
        ),
    ]
