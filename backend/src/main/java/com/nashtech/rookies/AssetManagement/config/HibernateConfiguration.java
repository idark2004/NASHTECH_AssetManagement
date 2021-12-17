package com.nashtech.rookies.AssetManagement.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
public class HibernateConfiguration {
    private Environment environment;

    @Autowired
    public void setEnvironment(Environment environment) {
        this.environment = environment;
    }

    @Bean(name = "dataSource")
    public DataSource dataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("org.postgresql.Driver");
        dataSource.setUsername(environment.getProperty("spring.datasource.username"));
        dataSource.setPassword(environment.getProperty("spring.datasource.password"));
        dataSource.setUrl(environment.getProperty("spring.datasource.url"));
        return dataSource;
    }

    @Autowired
    @Bean(name = "entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean sessionFactory(DataSource dataSource) {
        LocalContainerEntityManagerFactoryBean sessionFactoryBean = new LocalContainerEntityManagerFactoryBean();
        Properties properties = new Properties();
        HibernateJpaVendorAdapter jpaVendorAdapter = new HibernateJpaVendorAdapter();
        sessionFactoryBean.setDataSource(dataSource);
        properties.put("spring.jpa.properties.hibernate.dialect", environment.getProperty("spring.jpa.properties.hibernate.dialect"));
        properties.put("spring.jpa.show-sql", environment.getProperty("spring.jpa.show-sql"));
//        properties.put("current_session_context_class",
//                environment.getProperty("spring.jpa.properties.hibernate.current_session_context_class"));
        properties.put("spring.jpa.hibernate.ddl-auto", environment.getProperty("spring.jpa.hibernate.ddl-auto"));
//        properties.put("spring.jpa.hibernate.naming.implicit-strategy",environment.getProperty("spring.jpa.hibernate.naming-strategy"));
//        properties.put("spring.jpa.hibernate.naming.physical-strategy",environment.getProperty("spring.jpa.hibernate.naming.physical-strategy"));
        sessionFactoryBean.setPackagesToScan("com.nashtech.rookies.AssetManagement.model.entity");
        sessionFactoryBean.setJpaProperties(properties);
        sessionFactoryBean.setJpaVendorAdapter(jpaVendorAdapter);
        return sessionFactoryBean;
    }

    @Autowired
    @Bean(name = "transactionManager")
    public PlatformTransactionManager getTransactionManager(LocalContainerEntityManagerFactoryBean sessionFactory) {
        return new JpaTransactionManager(sessionFactory.getObject());
    }
}
