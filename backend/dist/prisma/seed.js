import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding for SentinelAI...');
    // 1. Roles & Permissions
    console.log('Creating Roles & Permissions...');
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
            description: 'System Administrator with full access to configuration, users, and audit logs',
            isSystem: true,
        },
    });
    const operatorRole = await prisma.role.upsert({
        where: { name: 'OPERATOR' },
        update: {},
        create: {
            name: 'OPERATOR',
            description: 'Safety Operator handling live monitoring, alerts, and triage',
            isSystem: true,
        },
    });
    const managementRole = await prisma.role.upsert({
        where: { name: 'MANAGEMENT' },
        update: {},
        create: {
            name: 'MANAGEMENT',
            description: 'Management & Executives viewing dashboards, analytics, and reports',
            isSystem: true,
        },
    });
    // 2. Default Users
    console.log('Creating Default Users...');
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('Password123!', salt);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@sentinel.ai' },
        update: {},
        create: {
            email: 'admin@sentinel.ai',
            passwordHash: defaultPasswordHash,
            firstName: 'Admin',
            lastName: 'Sentinel',
            roleId: adminRole.id,
            phone: '+1-555-0101',
        },
    });
    const operatorUser = await prisma.user.upsert({
        where: { email: 'operator@sentinel.ai' },
        update: {},
        create: {
            email: 'operator@sentinel.ai',
            passwordHash: defaultPasswordHash,
            firstName: 'Safety',
            lastName: 'Operator',
            roleId: operatorRole.id,
            phone: '+1-555-0102',
        },
    });
    const managementUser = await prisma.user.upsert({
        where: { email: 'management@sentinel.ai' },
        update: {},
        create: {
            email: 'management@sentinel.ai',
            passwordHash: defaultPasswordHash,
            firstName: 'Plant',
            lastName: 'Director',
            roleId: managementRole.id,
            phone: '+1-555-0103',
        },
    });
    // 3. Sites
    console.log('Creating Industrial Sites...');
    const northPlant = await prisma.site.upsert({
        where: { code: 'SITE-NP' },
        update: {},
        create: {
            name: 'North Plant Complex',
            code: 'SITE-NP',
            address: 'Industrial Sector 4, Northern Corridor',
            city: 'Detroit',
            state: 'MI',
            country: 'USA',
            latitude: 42.3314,
            longitude: -83.0458,
        },
    });
    const eastExpansion = await prisma.site.upsert({
        where: { code: 'SITE-EE' },
        update: {},
        create: {
            name: 'East Expansion',
            code: 'SITE-EE',
            address: 'Zone 7 Logistics Park',
            city: 'Cleveland',
            state: 'OH',
            country: 'USA',
            latitude: 41.4993,
            longitude: -81.6944,
        },
    });
    const southYard = await prisma.site.upsert({
        where: { code: 'SITE-SY' },
        update: {},
        create: {
            name: 'South Yard',
            code: 'SITE-SY',
            address: 'Harbor Road Dock 12',
            city: 'Toledo',
            state: 'OH',
            country: 'USA',
            latitude: 41.6528,
            longitude: -83.5379,
        },
    });
    // 4. Zones
    console.log('Creating Zones...');
    const boilerHouse = await prisma.zone.upsert({
        where: { code: 'ZONE-BH-B' },
        update: {},
        create: {
            name: 'Boiler House B',
            code: 'ZONE-BH-B',
            siteId: northPlant.id,
            zoneType: 'ppe_mandatory',
            riskLevel: 'critical',
            polygon: { type: 'Polygon', coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]] },
        },
    });
    const craneBay = await prisma.zone.upsert({
        where: { code: 'ZONE-CB-2' },
        update: {},
        create: {
            name: 'Crane Bay 2',
            code: 'ZONE-CB-2',
            siteId: northPlant.id,
            zoneType: 'exclusion',
            riskLevel: 'high',
            polygon: { type: 'Polygon', coordinates: [[[10, 10], [20, 10], [20, 20], [10, 20], [10, 10]]] },
        },
    });
    const fabYard = await prisma.zone.upsert({
        where: { code: 'ZONE-FAB-YARD' },
        update: {},
        create: {
            name: 'Fabrication Yard',
            code: 'ZONE-FAB-YARD',
            siteId: eastExpansion.id,
            zoneType: 'hot_work',
            riskLevel: 'high',
        },
    });
    const stackAccess = await prisma.zone.upsert({
        where: { code: 'ZONE-STACK' },
        update: {},
        create: {
            name: 'Stack Access',
            code: 'ZONE-STACK',
            siteId: northPlant.id,
            zoneType: 'general',
            riskLevel: 'medium',
        },
    });
    const gasStore = await prisma.zone.upsert({
        where: { code: 'ZONE-GAS' },
        update: {},
        create: {
            name: 'Gas Store',
            code: 'ZONE-GAS',
            siteId: southYard.id,
            zoneType: 'confined_space',
            riskLevel: 'critical',
        },
    });
    const gate1 = await prisma.zone.upsert({
        where: { code: 'ZONE-GATE1' },
        update: {},
        create: {
            name: 'Gate 1',
            code: 'ZONE-GATE1',
            siteId: northPlant.id,
            zoneType: 'general',
            riskLevel: 'low',
        },
    });
    // 5. Contractors
    console.log('Creating Contractors...');
    const contractorsData = [
        { name: 'Apex Industrial', code: 'CNT-001', safetyRating: 96.8, contactPerson: 'John Miller' },
        { name: 'BuildRight JV', code: 'CNT-002', safetyRating: 89.4, contactPerson: 'Sarah Jenkins' },
        { name: 'Nova Steelworks', code: 'CNT-003', safetyRating: 92.7, contactPerson: 'Dave Ross' },
        { name: 'SafeCore Services', code: 'CNT-004', safetyRating: 95.2, contactPerson: 'Elena Rostova' },
        { name: 'Horizon Engineering', code: 'CNT-005', safetyRating: 94.0, contactPerson: 'Michael Chang' },
        { name: 'Titan Heavy Lift', code: 'CNT-006', safetyRating: 91.5, contactPerson: 'Marcus Vance' },
        { name: 'Vertex Safety Tech', code: 'CNT-007', safetyRating: 97.2, contactPerson: 'Rachel Adams' },
        { name: 'PetroConstruct Ltd', code: 'CNT-008', safetyRating: 88.6, contactPerson: 'Carlos Ortiz' },
        { name: 'Shield Works', code: 'CNT-009', safetyRating: 93.4, contactPerson: 'Brian O’Connor' },
        { name: 'InfraGlobal JV', code: 'CNT-010', safetyRating: 90.1, contactPerson: 'Emma Watson' },
    ];
    const contractors = {};
    for (const c of contractorsData) {
        contractors[c.name] = await prisma.contractor.upsert({
            where: { code: c.code },
            update: {},
            create: {
                name: c.name,
                code: c.code,
                safetyRating: c.safetyRating,
                contactPerson: c.contactPerson,
                contactEmail: `${c.contactPerson.toLowerCase().replace(' ', '.')}@example.com`,
            },
        });
    }
    // 6. Work Fronts
    console.log('Creating Work Fronts...');
    const wf014 = await prisma.workFront.upsert({
        where: { code: 'WF-014' },
        update: {},
        create: {
            name: 'Boiler House B Overhaul',
            code: 'WF-014',
            siteId: northPlant.id,
            zoneId: boilerHouse.id,
            activity: 'welding',
            status: 'active',
            startDate: new Date('2026-10-01'),
        },
    });
    const wf021 = await prisma.workFront.upsert({
        where: { code: 'WF-021' },
        update: {},
        create: {
            name: 'Crane Bay 2 Structural Lift',
            code: 'WF-021',
            siteId: northPlant.id,
            zoneId: craneBay.id,
            activity: 'scaffolding',
            status: 'active',
            startDate: new Date('2026-10-15'),
        },
    });
    const wf033 = await prisma.workFront.upsert({
        where: { code: 'WF-033' },
        update: {},
        create: {
            name: 'Fabrication Yard Line 4',
            code: 'WF-033',
            siteId: eastExpansion.id,
            zoneId: fabYard.id,
            activity: 'hot_work',
            status: 'active',
            startDate: new Date('2026-10-20'),
        },
    });
    const wf042 = await prisma.workFront.upsert({
        where: { code: 'WF-042' },
        update: {},
        create: {
            name: 'Gas Store Manifold Relocation',
            code: 'WF-042',
            siteId: southYard.id,
            zoneId: gasStore.id,
            activity: 'confined_space',
            status: 'pending',
            startDate: new Date('2026-11-01'),
        },
    });
    // Assign Contractors to Work Fronts
    await prisma.contractorWorkFront.upsert({
        where: {
            contractorId_workFrontId_startDate: {
                contractorId: contractors['Apex Industrial'].id,
                workFrontId: wf014.id,
                startDate: new Date('2026-10-01'),
            },
        },
        update: {},
        create: {
            contractorId: contractors['Apex Industrial'].id,
            workFrontId: wf014.id,
            startDate: new Date('2026-10-01'),
        },
    });
    await prisma.contractorWorkFront.upsert({
        where: {
            contractorId_workFrontId_startDate: {
                contractorId: contractors['BuildRight JV'].id,
                workFrontId: wf021.id,
                startDate: new Date('2026-10-15'),
            },
        },
        update: {},
        create: {
            contractorId: contractors['BuildRight JV'].id,
            workFrontId: wf021.id,
            startDate: new Date('2026-10-15'),
        },
    });
    // 7. Cameras (matching frontend App.tsx CAM-042, CAM-017, CAM-088, CAM-061, CAM-023, CAM-011)
    console.log('Creating Cameras...');
    const camerasData = [
        { code: 'CAM-042', name: 'Boiler House B', siteId: northPlant.id, zoneId: boilerHouse.id, workFrontId: wf014.id, status: 'online', fps: 25.0, latency: 42.0 },
        { code: 'CAM-017', name: 'Crane Bay 2', siteId: northPlant.id, zoneId: craneBay.id, workFrontId: wf021.id, status: 'online', fps: 30.0, latency: 38.0 },
        { code: 'CAM-088', name: 'Fabrication Yard', siteId: eastExpansion.id, zoneId: fabYard.id, workFrontId: wf033.id, status: 'online', fps: 25.0, latency: 45.0 },
        { code: 'CAM-061', name: 'Stack Access', siteId: northPlant.id, zoneId: stackAccess.id, status: 'stale', fps: 10.0, latency: 180.0 },
        { code: 'CAM-023', name: 'Gas Store', siteId: southYard.id, zoneId: gasStore.id, workFrontId: wf042.id, status: 'online', fps: 25.0, latency: 35.0 },
        { code: 'CAM-011', name: 'Gate 1', siteId: northPlant.id, zoneId: gate1.id, status: 'offline', fps: 0.0, latency: 999.0 },
        // Additional cameras to make 18 total
        { code: 'CAM-001', name: 'Turbine Hall Entry', siteId: northPlant.id, zoneId: boilerHouse.id, status: 'online', fps: 30.0, latency: 25.0 },
        { code: 'CAM-002', name: 'Transformer Substation', siteId: northPlant.id, zoneId: craneBay.id, status: 'online', fps: 25.0, latency: 30.0 },
        { code: 'CAM-003', name: 'Conveyor Junction C', siteId: eastExpansion.id, zoneId: fabYard.id, status: 'online', fps: 25.0, latency: 40.0 },
        { code: 'CAM-004', name: 'Cooling Tower Base', siteId: northPlant.id, zoneId: stackAccess.id, status: 'online', fps: 25.0, latency: 32.0 },
        { code: 'CAM-005', name: 'Chemical Offloading Bay', siteId: southYard.id, zoneId: gasStore.id, status: 'online', fps: 25.0, latency: 48.0 },
        { code: 'CAM-006', name: 'Workshop North Pier', siteId: eastExpansion.id, zoneId: fabYard.id, status: 'online', fps: 25.0, latency: 35.0 },
        { code: 'CAM-007', name: 'Perimeter Fence East', siteId: northPlant.id, zoneId: gate1.id, status: 'online', fps: 30.0, latency: 29.0 },
        { code: 'CAM-008', name: 'Scaffolding Staging Area', siteId: northPlant.id, zoneId: craneBay.id, status: 'online', fps: 25.0, latency: 44.0 },
        { code: 'CAM-009', name: 'Heavy Machinery Route 2', siteId: eastExpansion.id, zoneId: fabYard.id, status: 'online', fps: 25.0, latency: 50.0 },
        { code: 'CAM-010', name: 'Emergency Muster Station 1', siteId: northPlant.id, zoneId: gate1.id, status: 'online', fps: 25.0, latency: 22.0 },
        { code: 'CAM-012', name: 'Elevated Pipe Rack 4', siteId: northPlant.id, zoneId: stackAccess.id, status: 'online', fps: 25.0, latency: 36.0 },
        { code: 'CAM-015', name: 'Hazardous Waste Dump', siteId: southYard.id, zoneId: gasStore.id, status: 'online', fps: 25.0, latency: 41.0 },
    ];
    const cameras = {};
    for (const cam of camerasData) {
        cameras[cam.code] = await prisma.camera.upsert({
            where: { cameraCode: cam.code },
            update: {},
            create: {
                cameraCode: cam.code,
                name: cam.name,
                siteId: cam.siteId,
                zoneId: cam.zoneId,
                workFrontId: cam.workFrontId,
                status: cam.status,
                recordingStatus: cam.status === 'online' ? 'active' : 'inactive',
                fps: cam.fps,
                networkLatency: cam.latency,
                lastFrameAt: cam.status === 'offline' ? new Date(Date.now() - 14 * 60 * 1000) : new Date(),
                rtspUrl: `rtsp://stream.sentinel.internal:554/live/${cam.code.toLowerCase()}`,
            },
        });
    }
    // 8. Model Versions
    console.log('Creating AI Model Versions...');
    const modelYolo = await prisma.modelVersion.upsert({
        where: { modelName_version: { modelName: 'SafetyVision', version: '4.8.2' } },
        update: {},
        create: {
            modelName: 'SafetyVision',
            version: '4.8.2',
            description: 'YOLO11-based multi-class detector with ByteTrack object tracker',
            metrics: { mAP50: 0.942, latencyMs: 184 },
        },
    });
    // 9. 54 Detection Definitions (D01-D54)
    console.log('Creating 54 Detection Definitions (D01-D54)...');
    const detectionCatalogue = [
        { code: 'D01', name: 'Helmet compliance', category: 'ppe', tier: 1, severity: 'critical', desc: 'Worker missing required safety hard hat' },
        { code: 'D02', name: 'Safety shoes compliance', category: 'ppe', tier: 1, severity: 'low', desc: 'Missing approved safety boots in industrial zone' },
        { code: 'D03', name: 'Hi-vis clothing compliance', category: 'ppe', tier: 1, severity: 'medium', desc: 'Worker without high-visibility vest or clothing' },
        { code: 'D04', name: 'Unsecured gas cylinder', category: 'material_handling', tier: 2, severity: 'medium', desc: 'Compressed gas cylinder standing without chain or restraint' },
        { code: 'D05', name: 'Eye & face protection', category: 'ppe', tier: 1, severity: 'medium', desc: 'Grinding or cutting without protective goggles or visor' },
        { code: 'D06', name: 'Hearing protection compliance', category: 'ppe', tier: 2, severity: 'low', desc: 'Absence of ear defenders in high-decibel area' },
        { code: 'D07', name: 'Safety gloves compliance', category: 'ppe', tier: 1, severity: 'low', desc: 'Handling abrasive or chemical material without gloves' },
        { code: 'D08', name: 'Unauthorized electrical panel access', category: 'access', tier: 1, severity: 'critical', desc: 'Non-certified person entering live substation enclosure' },
        { code: 'D09', name: 'Emergency exit blocked', category: 'access', tier: 1, severity: 'high', desc: 'Pallets or tools obstructing designated evacuation route' },
        { code: 'D10', name: 'Fire extinguisher obstructed', category: 'access', tier: 2, severity: 'medium', desc: 'Equipment placed within 1 meter of fire safety station' },
        { code: 'D11', name: 'Spill hazard uncontained', category: 'material_handling', tier: 2, severity: 'medium', desc: 'Chemical or oil leak pooling on floor' },
        { code: 'D12', name: 'Slip and trip hazard', category: 'general', tier: 3, severity: 'low', desc: 'Trailing cables or hoses across walkway' },
        { code: 'D13', name: 'Working under suspended load', category: 'access', tier: 1, severity: 'critical', desc: 'Personnel directly beneath active crane lifting zone' },
        { code: 'D14', name: 'Forklift operator seatbelt', category: 'material_handling', tier: 2, severity: 'medium', desc: 'Driver operating forklift without secured seatbelt' },
        { code: 'D15', name: 'Forklift speeding in bay', category: 'material_handling', tier: 2, severity: 'high', desc: 'Vehicle exceeding 10 km/h speed threshold' },
        { code: 'D16', name: 'Pedestrian in vehicle lane', category: 'access', tier: 1, severity: 'high', desc: 'Worker walking inside designated heavy vehicle thoroughfare' },
        { code: 'D17', name: 'Reversing vehicle without spotter', category: 'material_handling', tier: 1, severity: 'high', desc: 'Dump truck or excavator reversing with blindspot and no banksman' },
        { code: 'D18', name: 'Exclusion zone breach', category: 'access', tier: 1, severity: 'high', desc: 'Person entered active crane swing radius or danger zone' },
        { code: 'D19', name: 'Lone worker in high risk area', category: 'access', tier: 2, severity: 'high', desc: 'Single individual inside vessel without attendant buddy' },
        { code: 'D20', name: 'Man-down / fallen worker', category: 'emergency', tier: 1, severity: 'critical', desc: 'Worker prone on floor motionless for > 10 seconds' },
        { code: 'D21', name: 'Running / panic movement', category: 'emergency', tier: 2, severity: 'medium', desc: 'Rapid movement indicating potential incident or evacuation' },
        { code: 'D22', name: 'Smoking in restricted zone', category: 'hot_work', tier: 1, severity: 'critical', desc: 'Ignition source detected near flammable storage' },
        { code: 'D23', name: 'Mobile phone distraction', category: 'general', tier: 3, severity: 'low', desc: 'Operating machinery or walking near edge while looking at phone' },
        { code: 'D24', name: 'Unattended ladder', category: 'height', tier: 2, severity: 'medium', desc: 'Extension ladder erect without foot restraint or tie-off' },
        { code: 'D25', name: 'Overreaching from ladder', category: 'height', tier: 2, severity: 'medium', desc: 'Belt buckle past ladder stiles while working' },
        { code: 'D26', name: 'Working at height without railing', category: 'height', tier: 1, severity: 'critical', desc: 'Unprotected edge > 1.8m above ground without scaffold toe/mid-rail' },
        { code: 'D27', name: 'Harness not connected / tied-off', category: 'height', tier: 1, severity: 'critical', desc: 'Fall arrest lanyard unclipped from certified anchorage point' },
        { code: 'D28', name: 'Scaffolding missing green tag', category: 'height', tier: 2, severity: 'high', desc: 'Scaffolding accessed with yellow or red inspection tag' },
        { code: 'D29', name: 'Objects dropped from height', category: 'height', tier: 1, severity: 'high', desc: 'Tool or material falling through floor opening' },
        { code: 'D30', name: 'Hot work without permit active', category: 'hot_work', tier: 1, severity: 'critical', desc: 'Welding or torch cutting without active digital PTW' },
        { code: 'D31', name: 'Hot work without fire watch', category: 'hot_work', tier: 1, severity: 'high', desc: 'Cutting or brazing without dedicated fire watch personnel present' },
        { code: 'D32', name: 'Missing fire blanket / shield', category: 'hot_work', tier: 2, severity: 'medium', desc: 'Sparks projecting onto combustible substrate without enclosure' },
        { code: 'D33', name: 'Confined space entry without attendant', category: 'confined_space', tier: 1, severity: 'critical', desc: 'Vessel entry hole unmonitored by trained safety observer' },
        { code: 'D34', name: 'Missing continuous gas monitor', category: 'confined_space', tier: 1, severity: 'critical', desc: 'Confined space team entered without multi-gas detector clip' },
        { code: 'D35', name: 'Missing trip-pod / retrieval winch', category: 'confined_space', tier: 1, severity: 'high', desc: 'Vertical shaft access without mechanical rescue tripod' },
        { code: 'D36', name: 'Excavation trench without shoring', category: 'excavation', tier: 1, severity: 'critical', desc: 'Trench deeper than 1.5m without trench box or slope battering' },
        { code: 'D37', name: 'Heavy plant near trench edge', category: 'excavation', tier: 1, severity: 'high', desc: 'Excavator operating within zone of influence of unshielded trench' },
        { code: 'D38', name: 'Missing trench ladder access', category: 'excavation', tier: 2, severity: 'medium', desc: 'Excavation workers without egress ladder every 7.5 meters' },
        { code: 'D39', name: 'Loose material near trench lip', category: 'excavation', tier: 2, severity: 'medium', desc: 'Spoil pile placed within 1 meter of trench crest' },
        { code: 'D40', name: 'Underground utility strike risk', category: 'excavation', tier: 1, severity: 'high', desc: 'Mechanical tooth digging near marked electric or gas service' },
        { code: 'D41', name: 'Overcrowded work platform', category: 'general', tier: 2, severity: 'medium', desc: 'More than rated load of workers on suspended cradle' },
        { code: 'D42', name: 'Unbarricaded floor opening', category: 'height', tier: 1, severity: 'high', desc: 'Hatch or slab penetration left open without solid cover' },
        { code: 'D43', name: 'Improper lifting posture', category: 'ergonomics', tier: 3, severity: 'low', desc: 'Bending back with straight knees lifting load > 25kg' },
        { code: 'D44', name: 'Damaged wire rope or sling', category: 'material_handling', tier: 1, severity: 'critical', desc: 'Kinked, birdcaged or frayed wire rope used in crane hoist' },
        { code: 'D45', name: 'Crane outrigger without timber mats', category: 'material_handling', tier: 1, severity: 'high', desc: 'Mobile crane outriggers extended on soft soil without sole plates' },
        { code: 'D46', name: 'Missing tagline on crane lift', category: 'material_handling', tier: 2, severity: 'medium', desc: 'Long pipe or girder hoisted without guide rope' },
        { code: 'D47', name: 'Unauthorized tool modification', category: 'general', tier: 2, severity: 'high', desc: 'Angle grinder operated with safety guard removed' },
        { code: 'D48', name: 'Lockout/Tagout (LOTO) breach', category: 'access', tier: 1, severity: 'critical', desc: 'Breaker opened or closed with warning lock removed prematurely' },
        { code: 'D49', name: 'Radiation zone unauthorized access', category: 'access', tier: 1, severity: 'critical', desc: 'Worker within radiography perimeter during NDT testing' },
        { code: 'D50', name: 'Blasting exclusion boundary breach', category: 'access', tier: 1, severity: 'critical', desc: 'Trespass into rock blasting perimeter during siren warning' },
        { code: 'D51', name: 'Chemical vapor accumulation', category: 'confined_space', tier: 1, severity: 'critical', desc: 'Vapor plume detected near drainage catchment' },
        { code: 'D52', name: 'High noise area duration exceeded', category: 'general', tier: 3, severity: 'low', desc: 'Worker present without rotation for > 4 continuous hours' },
        { code: 'D53', name: 'Heat stress / fatigue symptom', category: 'emergency', tier: 2, severity: 'medium', desc: 'Worker staggering or showing thermal distress symptoms' },
        { code: 'D54', name: 'Demolition dust suppression compliance', category: 'excavation', tier: 3, severity: 'low', desc: 'Concrete jackhammering without active water mist dust mitigation' },
    ];
    const detections = {};
    for (const det of detectionCatalogue) {
        detections[det.code] = await prisma.detectionDefinition.upsert({
            where: { detectionCode: det.code },
            update: {},
            create: {
                detectionCode: det.code,
                name: det.name,
                category: det.category,
                description: det.desc,
                tier: det.tier,
                severity: det.severity,
                confidenceThreshold: det.tier === 1 ? 0.88 : 0.82,
                persistenceDuration: det.tier === 1 ? 2 : 3,
                cooldownPeriod: det.tier === 1 ? 30 : 60,
                modelVersionId: modelYolo.id,
            },
        });
    }
    // 10. Sample Alerts (Matching frontend seed: ALT-2048 to ALT-2043 and additional 50+)
    console.log('Creating Sample Alerts...');
    const frontendAlerts = [
        {
            code: 'ALT-2048',
            title: 'No helmet detected',
            det: 'D01',
            sev: 'critical',
            cam: 'CAM-042',
            site: northPlant.id,
            zone: boilerHouse.id,
            contractor: contractors['Apex Industrial'].id,
            status: 'raised',
            conf: 0.98,
            timeOffsetMins: 2,
        },
        {
            code: 'ALT-2047',
            title: 'Person inside exclusion zone',
            det: 'D18',
            sev: 'high',
            cam: 'CAM-017',
            site: northPlant.id,
            zone: craneBay.id,
            contractor: contractors['BuildRight JV'].id,
            status: 'acknowledged',
            conf: 0.94,
            timeOffsetMins: 4,
        },
        {
            code: 'ALT-2046',
            title: 'Hot work without fire watch',
            det: 'D31',
            sev: 'high',
            cam: 'CAM-088',
            site: eastExpansion.id,
            zone: fabYard.id,
            contractor: contractors['Nova Steelworks'].id,
            status: 'assigned',
            conf: 0.91,
            timeOffsetMins: 7,
        },
        {
            code: 'ALT-2045',
            title: 'Harness not connected',
            det: 'D27',
            sev: 'medium',
            cam: 'CAM-061',
            site: northPlant.id,
            zone: stackAccess.id,
            contractor: contractors['Apex Industrial'].id,
            status: 'action_taken',
            conf: 0.89,
            timeOffsetMins: 9,
        },
        {
            code: 'ALT-2044',
            title: 'Cylinder unsecured',
            det: 'D04',
            sev: 'medium',
            cam: 'CAM-023',
            site: southYard.id,
            zone: gasStore.id,
            contractor: contractors['SafeCore Services'].id,
            status: 'raised',
            conf: 0.96,
            timeOffsetMins: 12,
        },
        {
            code: 'ALT-2043',
            title: 'Missing safety shoes',
            det: 'D02',
            sev: 'low',
            cam: 'CAM-011',
            site: northPlant.id,
            zone: gate1.id,
            contractor: contractors['BuildRight JV'].id,
            status: 'false_positive',
            conf: 0.87,
            timeOffsetMins: 15,
        },
    ];
    for (const fa of frontendAlerts) {
        const occurredAt = new Date(Date.now() - fa.timeOffsetMins * 60 * 1000);
        const alert = await prisma.alert.upsert({
            where: { alertCode: fa.code },
            update: {},
            create: {
                alertCode: fa.code,
                detectionId: detections[fa.det].id,
                cameraId: cameras[fa.cam].id,
                siteId: fa.site,
                zoneId: fa.zone,
                contractorId: fa.contractor,
                title: fa.title,
                severity: fa.sev,
                confidence: fa.conf,
                status: fa.status,
                occurredAt,
                raisedAt: occurredAt,
                slaDeadline: new Date(occurredAt.getTime() + 30 * 60 * 1000),
                assignedUserId: fa.status === 'assigned' || fa.status === 'action_taken' ? operatorUser.id : null,
                actions: {
                    create: {
                        userId: operatorUser.id,
                        previousStatus: 'candidate',
                        newStatus: fa.status,
                        remarks: `Initial triage state: ${fa.status}`,
                    },
                },
            },
        });
        // Create a sample snapshot evidence for each
        await prisma.evidence.create({
            data: {
                alertId: alert.id,
                type: 'snapshot',
                fileName: `${fa.code}-frame.jpg`,
                filePath: `alerts/${alert.id}/${fa.code}-frame.jpg`,
                fileSize: 204800,
                mimeType: 'image/jpeg',
            },
        });
    }
    // Create additional 45 historical alerts to reach 50+ total
    console.log('Generating additional historical alerts...');
    const severities = ['critical', 'high', 'medium', 'low'];
    const statuses = ['closed', 'closed', 'action_taken', 'acknowledged', 'raised'];
    const contractorList = Object.values(contractors);
    const cameraList = Object.values(cameras);
    const detectionList = Object.values(detections);
    for (let i = 1; i <= 45; i++) {
        const code = `ALT-${1000 + i}`;
        const cam = cameraList[i % cameraList.length];
        const det = detectionList[i % detectionList.length];
        const cnt = contractorList[i % contractorList.length];
        const sev = severities[i % severities.length];
        const st = statuses[i % statuses.length];
        const daysAgo = Math.floor(i / 2);
        const occurredAt = new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000 + (i * 37) * 60 * 1000));
        await prisma.alert.upsert({
            where: { alertCode: code },
            update: {},
            create: {
                alertCode: code,
                detectionId: det.id,
                cameraId: cam.id,
                siteId: cam.siteId,
                zoneId: cam.zoneId,
                contractorId: cnt.id,
                title: `${det.name} violation`,
                severity: sev,
                confidence: 0.85 + (i % 14) * 0.01,
                status: st,
                occurredAt,
                raisedAt: occurredAt,
                closedAt: st === 'closed' ? new Date(occurredAt.getTime() + 20 * 60 * 1000) : null,
                closureRemarks: st === 'closed' ? 'Worker instructed to wear required PPE and compliance confirmed.' : null,
            },
        });
    }
    // 11. Shifts & Shift Handovers
    console.log('Creating Shifts & Handovers...');
    const dayShift = await prisma.shift.create({
        data: {
            name: 'Day Shift (06:00 - 14:00)',
            siteId: northPlant.id,
            startTime: '06:00',
            endTime: '14:00',
        },
    });
    await prisma.shiftHandover.create({
        data: {
            shiftId: dayShift.id,
            outgoingUserId: operatorUser.id,
            incomingUserId: adminUser.id,
            status: 'completed',
            acknowledgedAt: new Date(),
            notes: 'All boilers operating normally. Stack access camera CAM-061 frame rate dropped; ticket opened.',
            openAlerts: [{ code: 'ALT-2048', title: 'No helmet detected', severity: 'Critical' }],
            unresolvedFaults: [{ code: 'FLT-0001', entity: 'CAM-061', title: 'High network latency' }],
        },
    });
    // 12. Fault Tickets
    console.log('Creating Fault Tickets...');
    await prisma.faultTicket.upsert({
        where: { ticketCode: 'FLT-0001' },
        update: {},
        create: {
            ticketCode: 'FLT-0001',
            entityType: 'camera',
            entityId: cameras['CAM-061'].id,
            title: 'CAM-061 High RTSP latency and dropped frames',
            severity: 'medium',
            status: 'open',
            assignedTo: 'Network Ops',
        },
    });
    await prisma.faultTicket.upsert({
        where: { ticketCode: 'FLT-0002' },
        update: {},
        create: {
            ticketCode: 'FLT-0002',
            entityType: 'camera',
            entityId: cameras['CAM-011'].id,
            title: 'CAM-011 Gate 1 offline due to switch port flapping',
            severity: 'high',
            status: 'in_progress',
            assignedTo: 'Site Tech 2',
        },
    });
    // 13. Acceptance Records
    console.log('Creating Acceptance Records...');
    const acceptanceMetrics = [
        { name: 'Alert Latency (End-to-End)', value: 184, target: 1000, unit: 'ms', cat: 'latency' },
        { name: 'Mobile Delivery Latency', value: 1.2, target: 5.0, unit: 's', cat: 'latency' },
        { name: 'Camera Availability', value: 98.6, target: 98.0, unit: '%', cat: 'availability' },
        { name: 'System Core Availability', value: 99.94, target: 99.5, unit: '%', cat: 'availability' },
        { name: 'AI Detection Accuracy mAP@50', value: 94.2, target: 90.0, unit: '%', cat: 'accuracy' },
        { name: 'False Positive Rate', value: 3.8, target: 5.0, unit: '%', cat: 'accuracy' },
        { name: 'Evidence Completeness', value: 100.0, target: 100.0, unit: '%', cat: 'evidence' },
    ];
    for (const m of acceptanceMetrics) {
        await prisma.acceptanceRecord.create({
            data: {
                metricName: m.name,
                metricValue: m.value,
                target: m.target,
                unit: m.unit,
                category: m.cat,
                status: 'pass',
                measuredAt: new Date(),
                signedOffBy: managementUser.id,
                signedOffAt: new Date(),
                notes: 'Verified during Factory Acceptance Test (FAT)',
            },
        });
    }
    console.log('✅ SentinelAI database seeding completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map