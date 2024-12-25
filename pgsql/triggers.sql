-- FUNCTION
CREATE OR REPLACE FUNCTION zabbix_notify()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    -- Send the notification with itemid, clock, and value
    PERFORM pg_notify(
      'zabbix_live', 
      ('itemid:' || NEW.itemid || 
       ',ts:' || NEW.clock || 
       ',value:' || NEW.value)::text
    );

    RETURN NEW;
END;
$function$;

-- TRIGGER
CREATE TRIGGER zabbix_trigger
AFTER INSERT ON history
FOR EACH ROW
EXECUTE FUNCTION zabbix_notify();

-- TEST NOTIFICATION
SELECT pg_notify('zabbix_live', 'test_notification');
