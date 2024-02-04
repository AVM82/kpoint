# Проєкт *"проєктів"*
Система для відстеження стартапів до їх створення.

# C1: Context 
## Ролі користувачів на сервісі:
* Адмін сервісу (admin)
* Користувач (user)
* Аудитор (auditor)

```plantuml
@startuml
!include <C4/C4_Container>

Person(Admin, "Адмін", "Адміністратор K-points сервісу")
Person(User, "Користувач", "Авторизований користувач системи")
Person(Auditor, "Аудитор", "Перевірений сервісом extra-користувач")

System(KPointsSystem, "Проєкт проєктів", "K-Points Hub", "KPointsSystem")
System_Ext(Solana, "Solana блокчейн", "An external public blockchain")

Rel_R(User, KPointsSystem, "Створює, підтримує свої проєкти", "REST API")
Rel_R(User, KPointsSystem, "Get project list, reports and alerts", "REST API, email")

Rel_L(Auditor, KPointsSystem, "Check users & project reports", "REST API")

Rel_D(Admin, KPointsSystem, "Manage of system", "REST API")
Rel_D(Admin, KPointsSystem, "Analyze logs", "REST API")

Rel_U(Solana, KPointsSystem, "Send data to Public blockchain", "Blockchain API")

@enduml
```

## Ролі користувачів на проєкті:
* Власник проєкту (owner)
* Зацікавлений (follower)
* Вкладник (contributor)
* Партнер (partner)

```plantuml
@startuml
!include <C4/C4_Container>

Person(Owner, "Власник", "Власник проєкту")
Person(Follower, "Зацікавлений", "Користувач, що підписався на новини проєкту")
Person(Contributor, "Вкладник", "Користувач, що зробив внесок(кошти чи роботу) у проєкт")
Person(Partner, "Партнер", "Власник частки у проєкті")

System(KPoint, "Проєкт", "Прибутковий проєкт", "KPoint")
System_Ext(Solana, "Solana Valet", "Відображення проєкту у блокчейн")

Rel_D(Owner, KPoint, "Створює проєкт, публікує звіти", "REST API")
Rel_R(Follower, KPoint, "Отримує новини і звіти проєкту", "REST API, email")
Rel_L(Partner, KPoint, "Отримує новини і звіти проєкту + звіт про частки", "REST API, email")
Rel_L(Contributor, KPoint, "Отримує новини і звіти проєкту + звіт про внесок", "REST API, email")

Rel_D(KPoint, Solana, "Store Tx to BC", "Blockchain API")
Rel_D(Solana, KPoint, "Send data by request", "Blockchain API")

@enduml
```

# C2: Containers
* Backend: REST API  
* Frontend: SPA (projects + project pages) 
* База даних проєктів (+ Flyway)
* Адмінка
* Пошуковий (і рекомендаційний) сервіс
* Feature request's сервіс
* Поштовий сервіс: Amazon SES
* SMM: Sitemap для кожного проєкту
* CI/CD: Build & deploy to test/prod environments 
* Моніторинг: Grafana with alerts to TG 

# C3: Components
## Backend: REST API 
* Spring Boot 3.2 + Spring MVC (JDK17, maven)
* Project Controller: CRUD with Swagger
* Auth: Spring Security by email or OAuth2 using Google 
* Models: User, Project 
## Frontend: SPA (projects + project pages)
* SPA using React 
* Auth: JWT token
## База даних проєктів (+ Flyway)
* RDS PostgreSQL
* Flyway
## Адмінка
* Список юзерів з можливістю бану (заборони авторизації)
* Список проєктів з можливістю зробити їх read-only та або прихованими
## Пошуковий (і рекомендаційний) сервіс
* Search by user requests and user attributes
* Search endpoint
* Prioritized list endpoint
## Feature request's сервіс
* RDS PostgreSQL?, search by user requests & attributes
* Search endpoint
## Поштовий сервіс: Amazon SES
* Amazon SES
* Approve user's emails
* Spring Schedule service for sending emails
## SMM: Sitemap для кожного проєкту
* Reglament to create Sitemap periodically
## CI/CD: Build & deploy to test/prod environments
* Setup CI/CD and describe review/merge rules
## Моніторинг: Grafana with alerts to TG
* Add request count metrics to all controllers
* Alert setup to the new telegram group 